import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {InstagramService} from '../../../services/instagram.service';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';

const DELAY_TIMEOUT = 3500; // milliseconds

@Component({
  styleUrls: ['./identities.instagram.component.scss'],
  templateUrl: './identities.instagram.component.html',
})
export class IdentitiesInstagramComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * True if something is loading.
   */
  loading = true;

  /**
   * True if posts are loading.
   */
  loadingPosts = false;

  /**
   * Posts array.
   */
  posts: any[] = [];

  /**
   * Share profile option.
   */
  shareProfile: boolean;

  /**
   * Share messages option.
   */
  shareMessages: boolean;

  /**
   * Application name.
   */
  appName: string;

  // data source containing user Instagram profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  // variable returned by Instagram and used to complete association process
  private authorizationCode: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private instagramService: InstagramService,
    private toast: ToastrService,
    private dialog: MatDialog,
  ) {
    this.appName = environment.appName;
  }

  /**
   * @Override
   */
  ngOnInit(): void {
    this.authService.getUser().then((user) => {
      if (user && user.identities && user.identities.instagram) {
        this.loading = false;
        this.user = user;

        this.setupInstagramProfileTable();
        this.updatePosts(10);

        // set share values
        this.shareProfile = this.user.identities.configs.instagramConfig.shareProfile;
        this.shareMessages = this.user.identities.configs.instagramConfig.shareMessages;

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {

        // reading parameters returned by Instagram
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.instagramService.accessToken(this.authorizationCode).subscribe((res) => {
              // update Instagram profile
               this.updateProfile();
            });
          } else {
            this.loading = false;
          }
        });
      }
    });
  }

  /**
   * Associate user account with Instagram.
   */
  associate() {
    this.instagramService.getLoginDialog().subscribe(
      (res) => {
        window.location.href = res.loginDialogUrl;
      },
      (err) => {
        if (!isNullOrUndefined(err.error.message)) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error('Server error occurred. Try again later.');
        }
      });
  }

  /**
   * Update user Instagram profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {
    this.instagramService.profile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;

        // set share values
        this.shareProfile = this.user.identities.configs.instagramConfig.shareProfile;
        this.shareMessages = this.user.identities.configs.instagramConfig.shareMessages;

        this.setupInstagramProfileTable();
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  private setupInstagramProfileTable() {
    // user Instagram data
    const instagram = this.user.identities.instagram;

    // array used to populate the data source object
    const instagramProfile: {dataName: string, dataValue: any}[] = [];
    instagramProfile.push({dataName: 'Full Name', dataValue: instagram['full_name']});
    instagramProfile.push({dataName: 'Username', dataValue: instagram['username']});
    instagramProfile.push({dataName: 'Bio', dataValue: instagram['bio']});
    instagramProfile.push({dataName: 'Website', dataValue: instagram['website']});
    instagramProfile.push({dataName: 'Follows', dataValue: instagram['follows']});
    instagramProfile.push({dataName: 'Followers', dataValue: instagram['followed_by']});
    instagramProfile.push({dataName: 'Picture', dataValue: instagram['picture']});
    this.dataSource = new MatTableDataSource(instagramProfile);
  }

  /**
   * Update user Posts.
   * @param messagesToRead: the messages number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updatePosts(messagesToRead?: number, showToast?: boolean) {
    this.loadingPosts = true;
    this.instagramService.userPosts(messagesToRead).subscribe(
      (res) => {
        this.loadingPosts = false;
        if (res) {
          if (showToast) {
            this.toast.success('Posts Updated');
          }
          if (res.messages && res.messages.length > 0) {
            this.posts = res.messages;
          } else if (!messagesToRead) {
            this.loadingPosts = true;
            setTimeout(() => this.updatePosts(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingPosts = false;
      });
  }

  /**
   * Update share profile.
   */
  updateShareProfile() {
    this.instagramService.configuration({shareProfile: this.shareProfile}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share messages.
   */
  updateShareMessages() {
    this.instagramService.configuration({shareMessages: this.shareMessages}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Delete Instagram information account, including posts and likes.
   */
  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your Instagram account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.instagramService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.instagram = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });
  }
}

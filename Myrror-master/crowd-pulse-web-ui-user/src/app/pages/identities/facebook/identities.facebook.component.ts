import {Component, OnInit} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../../../environments/environment';

const DELAY_TIMEOUT = 3500; // milliseconds

@Component({
  styleUrls: ['./identities.facebook.component.scss'],
  templateUrl: './identities.facebook.component.html',
})
export class IdentitiesFacebookComponent implements OnInit {

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
   * True if likes are loading.
   */
  loadingLikes = false;

  /**
   * True if friends are loading.
   */
  loadingFriends = false;

  /**
   * Posts array.
   */
  posts: any[] = [];

  /**
   * Likes array.
   */
  likes: any[] = [];

  /**
   * Friends array.
   */
  friends: any[] = [];

  /**
   * Share profile option.
   */
  shareProfile: boolean;

  /**
   * Share messages option.
   */
  shareMessages: boolean;

  /**
   * Share friends option.
   */

  shareFriends: boolean;

  /**
   * Share likes option.
   */
  shareLikes: boolean;

  /**
   * Application name.
   */
  appName: string;

  // data source containing user Facebook profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  // variable returned by Facebook and used to complete association process
  private authorizationCode: string;

  constructor(
    private facebookService: FacebookService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.appName = environment.appName;
  }

  /**
   * @override
   */
  ngOnInit(): void {
    this.authService.getUser().then((user) => {
      if (user && user.identities && user.identities.facebook) {
        this.loading = false;
        this.user = user;
        this.setupFacebookProfileTable();
        this.updatePosts(10);
        this.updateLikes(10);
        this.updateFriends(10);

        // set share values
        this.shareProfile = this.user.identities.configs.facebookConfig.shareProfile;
        this.shareMessages = this.user.identities.configs.facebookConfig.shareMessages;
        this.shareFriends = this.user.identities.configs.facebookConfig.shareFriends;
        this.shareLikes = this.user.identities.configs.facebookConfig.shareLikes;

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {

        // reading parameters returned by Facebook
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.facebookService.accessToken(this.authorizationCode).subscribe((res) => {

              // update Facebook profile
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
   * Associate user account with Facebook.
   */
  associate() {
    this.facebookService.getLoginDialog().subscribe(
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
   * Update user Facebook profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {
    this.facebookService.profile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;

        // set share values
        this.shareProfile = this.user.identities.configs.facebookConfig.shareProfile;
        this.shareMessages = this.user.identities.configs.facebookConfig.shareMessages;
        this.shareFriends = this.user.identities.configs.facebookConfig.shareFriends;
        this.shareLikes = this.user.identities.configs.facebookConfig.shareLikes;

        this.setupFacebookProfileTable();
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Update user Posts.
   * @param messagesToRead: the messages number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updatePosts(messagesToRead?: number, showToast?: boolean) {
    this.loadingPosts = true;
    this.facebookService.userPosts(messagesToRead).subscribe(
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
   * Update user likes.
   * @param likesToRead: the likes number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updateLikes(likesToRead?: number, showToast?: boolean) {
    this.loadingLikes = true;
    this.facebookService.likes(likesToRead).subscribe(
      (res) => {
        this.loadingLikes = false;
        if (res) {
          if (showToast) {
            this.toast.success('Likes Updated');
          }
          if (res.likes && res.likes.length > 0) {
            this.likes = res.likes;
          } else if (!likesToRead) {
            this.loadingLikes = true;
            setTimeout(() => this.updateLikes(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingLikes = false;
      });
  }

  /**
   * Update user friends.
   * @param friendsToRead: the friends number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updateFriends(friendsToRead?: number, showToast?: boolean) {
    this.loadingFriends = true;
    this.facebookService.friends(friendsToRead).subscribe(
      (res) => {
        this.loadingFriends = false;
        if (res) {
          if (showToast) {
            this.toast.success('Friends Updated');
          }
          if (res.friends && res.friends.length > 0) {
            this.friends = res.friends;
          } else if (!friendsToRead) {
            this.loadingFriends = true;
            setTimeout(() => this.updateFriends(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingFriends = false;
      });
  }

  /**
   * Update share profile.
   */
  updateShareProfile() {
    this.facebookService.configuration({shareProfile: this.shareProfile}).subscribe((res) => {
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
    this.facebookService.configuration({shareMessages: this.shareMessages}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share friends.
   */
  updateShareFriends() {
    this.facebookService.configuration({shareFriends: this.shareFriends}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }


  /**
   * Update share likes.
   */
  updateShareLikes() {
    this.facebookService.configuration({shareLikes: this.shareLikes}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Delete Facebook information account, including posts and likes.
   */
  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your Facebook account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.facebookService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.facebook = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });
  }

  /**
   * Populate the dataSource object reading the element from user Facebook profile.
   */
  private setupFacebookProfileTable() {

    // user Facebook data
    const facebook = this.user.identities.facebook;

    // array used to populate the data source object
    const facebookProfile: {dataName: string, dataValue: any}[] = [];
    facebookProfile.push({dataName: 'Full Name', dataValue: facebook['name']});
    facebookProfile.push({dataName: 'Picture', dataValue: facebook['picture']});
    facebookProfile.push({dataName: 'Gender', dataValue: facebook['gender']});
    facebookProfile.push({dataName: 'Languages', dataValue: facebook['languages']});
    this.dataSource = new MatTableDataSource(facebookProfile);
  }
}

import {Component, OnInit} from '@angular/core';
import {LinkedinService} from '../../../services/linkedin.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../services/auth.service';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../../../environments/environment';

@Component({
  styleUrls: ['./identities.linkedin.component.scss'],
  templateUrl: './identities.linkedin.component.html',
})
export class IdentitiesLinkedinComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * True if something is loading.
   */
  loading = true;

  /**
   * Share profile option.
   */
  shareProfile: boolean;

  /**
   * Application name.
   */
  appName: string;

  // data source containing user LinkedIn profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  private authorizationCode: string;

  constructor(
    private linkedinService: LinkedinService,
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
      if (user && user.identities && user.identities.linkedIn) {
        this.loading = false;
        this.user = user;
        this.setupLinkedinProfileTable();

        // set share value
        this.shareProfile = this.user.identities.configs.linkedInConfig.shareProfile;

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {

        // reading parameters returned by LinkedIn
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.linkedinService.accessToken(this.authorizationCode).subscribe((res) => {

              // update user profile
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
   * Associate user account with LinkedIn.
   */
  associate() {
    this.linkedinService.getLoginDialog().subscribe(
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
   * Update user LinkedIn profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {
    this.linkedinService.userProfile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;

        // set share value
        this.shareProfile = this.user.identities.configs.linkedInConfig.shareProfile;

        this.setupLinkedinProfileTable();
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Update share profile.
   */
  updateShareProfile() {
    this.linkedinService.configuration(this.shareProfile).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Delete LinkedIn information account.
   */
  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your LinkedIn account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.linkedinService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.linkedIn = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });
  }

  /**
   * Populate the dataSource object reading the element from user LinkedIn profile.
   */
  private setupLinkedinProfileTable() {

    // user LinkedIn data
    const linkedIn = this.user.identities.linkedIn;

    // array used to populate the data source object
    const linkedInProfile: {dataName: string, dataValue: any}[] = [];
    linkedInProfile.push({dataName: 'Name', dataValue: linkedIn['firstName']});
    linkedInProfile.push({dataName: 'Surname', dataValue: linkedIn['lastName']});
    linkedInProfile.push({dataName: 'Picture', dataValue: linkedIn['pictureUrl']});
    linkedInProfile.push({dataName: 'Location', dataValue: linkedIn['location']});
    linkedInProfile.push({dataName: 'Industry', dataValue: linkedIn['industry']});
    linkedInProfile.push({dataName: 'Connections', dataValue: linkedIn['numConnections']});
    this.dataSource = new MatTableDataSource(linkedInProfile);
  }

}

import {Component, OnInit} from '@angular/core';
import {FitbitService} from '../../../services/fitbit.service';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../../../environments/environment';

const DELAY_TIMEOUT = 3500; // milliseconds

@Component({
  styleUrls: ['./identities.fitbit.component.scss'],
  templateUrl: './identities.fitbit.component.html',
})
export class IdentitiesFitbitComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * Activity array.
   */
  activities = [];

  /**
   * Weight array.
   */
  weights: any[] = [];

  /**
   * Fat array.
   */
  fats: any[] = [];

  /**
   * BMI array.
   */
  bmis: any[] = [];


  /**
   * Food array.
   */
  foods: any[] = [];

  /**
   * Friends array.
   */
  friends: any[] = [];

  /**
   * Heart Rate array.
   */
  heart: any[] = [];

  /**
   * Sleep array.
   */
  sleep: any[] = [];


  /**
   * True if something is loading.
   */
  loading = true;

  /**
   * True if activity are loading.
   */
  loadingActivity = false;

  /**
   * True if fat is loading.
   */
  loadingBody_Fat = false;

  /**
   * True if BMI is loading.
   */
  loadingBody_Bmi = false;

  /**
   * True if weight is loading.
   */
  loadingBody_Weight = false;


  /**
   * True if food are loading.
   */
  loadingFood = false;

  /**
   * True if friends are loading.
   */
  loadingFriends = false;

  /**
   * True if heart rate are loading.
   */
  loadingHeartRate = false;

  /**
   * True if sleep are loading.
   */
  loadingSleep = false;

  /**
   * Share profile option.
   */
  shareProfile: boolean;

  /**
   * Share activity option.
   */
  shareActivity: boolean;

  /**
   * Share body & weight option.
   */
  shareBodyWeight: boolean;

  /**
   * Share body & fat option.
   */
  shareBodyFat: boolean;

  /**
   * Share body & BMI option.
   */
  shareBodyBmi: boolean;


  /**
   * Share food option.
   */
  shareFood: boolean;

  /**
   * Share friends option.
   */
  shareFriends: boolean;

  /**
   * Share heart rate option.
   */
  shareHeartRate: boolean;

  /**
   * Share sleep option.
   */
  shareSleep: boolean;

  /**
   * Application name.
   */
  appName: string;

  // data source containing user Fitbit profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  // variable returned by Fitbit and used to complete association process
  private authorizationCode: string;

  constructor(
    private fitbitService: FitbitService,
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
      if (user && user.identities && user.identities.fitbit) {


        this.fitbitService.refreshAccessToken(this.authorizationCode).subscribe((res) => {
        });
        this.loading = false;
        this.user = user;
        this.setupFitbitProfileTable();
        this.updateFriends(10);
        this.updateSleep(10);
        this.updateFood(10);
        this.updateBody_Weight(1);
        this.updateBody_Fat(1);
        this.updateBody_Bmi(1);
        this.updateHeartRate(10);
        this.updateActivity(10);



        // set share values
        this.shareActivity = this.user.identities.configs.fitbitConfig.shareActivity;
        this.shareProfile = this.user.identities.configs.fitbitConfig.shareProfile;
        this.shareFriends = this.user.identities.configs.fitbitConfig.shareFriends;
        this.shareBodyWeight = this.user.identities.configs.fitbitConfig.shareBodyWeight;
        this.shareBodyFat = this.user.identities.configs.fitbitConfig.shareBodyFat;
        this.shareBodyBmi = this.user.identities.configs.fitbitConfig.shareBodyBmi;
        this.shareSleep = this.user.identities.configs.fitbitConfig.shareSleep;
        this.shareHeartRate = this.user.identities.configs.fitbitConfig.shareHeartRate;
        this.shareFood = this.user.identities.configs.fitbitConfig.shareFood;

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {

        // reading parameters returned by Fitbit
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.fitbitService.accessToken(this.authorizationCode).subscribe((res) => {

              // update Fitbit profile
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
   * Associate user account with Fitbit.
   */
  associate() {
    this.fitbitService.getLoginDialog().subscribe(
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
   * Update user Fitbit profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {

    this.fitbitService.profile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;

        // set share values
        this.shareActivity = this.user.identities.configs.fitbitConfig.shareActivity;
        this.shareProfile = this.user.identities.configs.fitbitConfig.shareProfile;
        this.shareFriends = this.user.identities.configs.fitbitConfig.shareFriends;
        this.shareBodyWeight = this.user.identities.configs.fitbitConfig.shareBodyWeight;
        this.shareBodyFat = this.user.identities.configs.fitbitConfig.shareBodyFat;
        this.shareBodyBmi = this.user.identities.configs.fitbitConfig.shareBodyBmi;
        this.shareSleep = this.user.identities.configs.fitbitConfig.shareSleep;
        this.shareHeartRate = this.user.identities.configs.fitbitConfig.shareHeartRate;
        this.shareFood = this.user.identities.configs.fitbitConfig.shareFood;


        this.setupFitbitProfileTable();
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Update user Activity.
   * @param showToast: if you want to show the toast messages
   */
  updateActivity(activityToRead?: number, showToast?: boolean)  {
    this.loadingActivity = true;
    this.fitbitService.userActivity(activityToRead).subscribe(
      (res) => {
        this.loadingActivity = false;
        if (res) {
          if (showToast) {
            this.toast.success('Activity Updated');
          }
          if (res.steps) {
            this.activities.push({
              steps: res.steps,
              calories: res.calories,
              elevation: res.elevation,
              minutesLightlyActive: res.minutesLightlyActive,
              veryActive: res.veryActive,
              minutesSedentary: res.minutesSedentary,
              fairly: res.fairly,
              distance: res.distance,
              floors: res.floors});
          } else if (!activityToRead) {
            this.loadingActivity = true;
            setTimeout(() => this.updateActivity(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingActivity = false;
      });
  }


  /**
   * Update user Body & Weight.
   * @param showToast: if you want to show the toast messages
   */
  updateBody_Weight(bodyToRead?: number, showToast?: boolean)  {
    this.loadingBody_Weight = true;
    this.fitbitService.userBody_Weight(bodyToRead).subscribe(
      (res) => {

        this.loadingBody_Weight = false;
        if (res) {
          if (showToast) {
            this.toast.success('Weight Updated');
          }
          if (res.weight && res.weight.length > 0) {
            this.weights = res.weight;
          } else if (!bodyToRead) {
            this.loadingBody_Weight = true;
            setTimeout(() => this.updateBody_Weight(1), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingBody_Weight = false;
      });
  }



  /**
   * Update user Body & Fat.
   * @param showToast: if you want to show the toast messages
   */
  updateBody_Fat(fatToRead?: number, showToast?: boolean)  {
    this.loadingBody_Fat = true;
    this.fitbitService.userBody_Fat(fatToRead).subscribe(
      (res) => {

        this.loadingBody_Fat = false;
        if (res) {
          if (showToast) {
            this.toast.success('Fat Updated');
          }
          if (res.fat && res.fat.length > 0) {
            this.fats = res.fat;
          } else if (!fatToRead) {
            this.loadingBody_Fat = true;
            setTimeout(() => this.updateBody_Fat(1), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingBody_Fat = false;
      });
  }


  /**
   * Update user Body & BMI.
   * @param showToast: if you want to show the toast messages
   */
  updateBody_Bmi(bmiToRead?: number, showToast?: boolean)  {
    this.loadingBody_Bmi = true;
    this.fitbitService.userBody_Bmi(bmiToRead).subscribe(
      (res) => {

        this.loadingBody_Bmi = false;
        if (res) {
          if (showToast) {
            this.toast.success('BMI Updated');
          }
          if (res.bmi && res.bmi.length > 0) {
            this.bmis = res.bmi;
          } else if (!bmiToRead) {
            this.loadingBody_Bmi = true;
            setTimeout(() => this.updateBody_Bmi(1), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingBody_Bmi = false;
      });
  }



  /**
   * Update user Food.
   * @param showToast: if you want to show the toast messages
   */
  updateFood(foodToRead?: number, showToast?: boolean)  {
    this.loadingFood = true;
    this.fitbitService.userFood(foodToRead).subscribe(
      (res) => {
        this.loadingFood = false;
        if (res) {
          if (showToast) {
            this.toast.success('Food Updated');
          }
          if (res.foods && res.foods.length > 0) {
            this.foods = res.foods;

          } else if (!foodToRead) {
            this.loadingFood = true;
            setTimeout(() => this.updateFood(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingFood = false;
      });
  }



  /**
   * Update user Friends.
   * @param showToast: if you want to show the toast messages
   */
  updateFriends(friendsToRead?: number, showToast?: boolean)  {
    this.loadingFriends = true;
    this.fitbitService.userFriends(friendsToRead).subscribe(
      (res) => {
        this.loadingFriends = false;
        if (res) {
          if (showToast) {
            this.toast.success('Friend Updated');
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
   * Update user Heart Rate.
   * @param showToast: if you want to show the toast messages
   */
  updateHeartRate(heartToRead?: number, showToast?: boolean)  {

    this.loadingHeartRate = true;
    this.fitbitService.userHeartRate(heartToRead).subscribe(
      (res) => {
        this.loadingHeartRate = false;
        if (res) {
          if (showToast) {
            this.toast.success('Heart Rate Updated');
          }
          if (res.heart && res.heart.length > 0) {
            this.heart = res.heart;
          } else if (!heartToRead) {
            this.loadingHeartRate = true;
            setTimeout(() => this.updateHeartRate(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingHeartRate = false;
      });
  }


  /**
   * Update user Sleep.
   * @param sleepToRead: the sleep number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updateSleep(sleepToRead?: number, showToast?: boolean)  {
    this.loadingSleep = true;
    this.fitbitService.userSleep(sleepToRead).subscribe(
      (res) => {
        this.loadingSleep = false;
        if (res) {
          if (showToast) {
            this.toast.success('Sleep Updated');
          }
          if (res.sleep && res.sleep.length > 0) {
            this.sleep = res.sleep;
          } else if (!sleepToRead) {
            this.loadingSleep = true;
            setTimeout(() => this.updateSleep(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingSleep = false;
      });
  }



  /**
   * Update share profile.
   */
  updateShareProfile() {
    this.fitbitService.configuration({shareProfile: this.shareProfile}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share activity.
   */
  updateShareActivity() {
    this.fitbitService.configuration({shareActivity: this.shareActivity}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share body & weight.
   */
  updateShareBody_Weight() {
    this.fitbitService.configuration({shareBodyWeight: this.shareBodyWeight}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }


  /**
   * Update share food.
   */
  updateShareFood() {
    this.fitbitService.configuration({shareFood: this.shareFood}).subscribe((res) => {
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
    this.fitbitService.configuration({shareFriends: this.shareFriends}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share heart rate.
   */
  updateShareHeartRate() {
    this.fitbitService.configuration({shareHeartRate: this.shareHeartRate}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share sleep.
   */
  updateShareSleep() {
    this.fitbitService.configuration({shareSleep: this.shareSleep}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Delete Fitbit information account, including posts and likes.
   */
  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your Fitbit account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.fitbitService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.fitbit = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });
  }

  /**
   * Populate the dataSource object reading the element from user Fitbit profile.
   */
  private setupFitbitProfileTable() {

    // user Fitbit data
    const fitbit = this.user.identities.fitbit;

    // array used to populate the data source object
    const fitbitProfile: {dataName: string, dataValue: any}[] = [];

    if (fitbit['fullName'] && fitbit['fullName'] !== '') {
      fitbitProfile.push({dataName: 'FullName', dataValue: fitbit['fullName']});
    }
    if (fitbit['displayName'] && fitbit['displayName'] !== '') {
      fitbitProfile.push({dataName: 'displayName', dataValue: fitbit['displayName']});
    }
    if (fitbit['locale'] && fitbit['locale'] !== '') {
      fitbitProfile.push({dataName: 'locale', dataValue: fitbit['locale']});
    }
    if (fitbit['gender'] && fitbit['gender'] !== '') {
      fitbitProfile.push({dataName: 'Gender', dataValue: fitbit['gender']});
    }
    if (fitbit['city'] && fitbit['city'] !== '') {
      fitbitProfile.push({dataName: 'city', dataValue: fitbit['city']});
    }
    if (fitbit['country'] && fitbit['country'] !== '') {
      fitbitProfile.push({dataName: 'country', dataValue: fitbit['country']});
    }
    if (fitbit['state'] && fitbit['state'] !== '') {
      fitbitProfile.push({dataName: 'state', dataValue: fitbit['state']});
    }
    if (fitbit['weight'] && fitbit['weight'] !== '') {
      fitbitProfile.push({dataName: 'weight', dataValue: fitbit['weight']});
    }
    if (fitbit['weightUnit'] && fitbit['weightUnit'] !== '') {
      fitbitProfile.push({dataName: 'weightUnit', dataValue: fitbit['weightUnit']});
    }
    if (fitbit['dateOfBirth'] && fitbit['dateOfBirth'] !== '') {
      fitbitProfile.push({dataName: 'dateOfBirth', dataValue: fitbit['dateOfBirth']});
    }
    if (fitbit['height'] && fitbit['height'] !== '') {
      fitbitProfile.push({dataName: 'height', dataValue: fitbit['height']});
    }
    if (fitbit['heightUnit'] && fitbit['heightUnit'] !== '') {
      fitbitProfile.push({dataName: 'heightUnit', dataValue: fitbit['heightUnit']});
    }
    this.dataSource = new MatTableDataSource(fitbitProfile);
  }
}

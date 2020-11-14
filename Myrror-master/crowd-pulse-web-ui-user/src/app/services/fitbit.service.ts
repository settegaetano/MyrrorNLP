import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';

const API_LOGIN_DIALOG = 'api/fitbit/login_dialog';
const API_REQUEST_TOKEN = 'api/fitbit/request_token';
const API_REFRESH_TOKEN = 'api/fitbit/refresh_token';


const API_USER_PROFILE = 'api/fitbit/profile';
const API_USER_ACTIVITY = 'api/fitbit/activity';
const API_USER_BODY_WEIGHT = 'api/fitbit/body_weight';
const API_USER_BODY_FAT = 'api/fitbit/body_fat';
const API_USER_BODY_BMI = 'api/fitbit/body_bmi';
const API_USER_FOOD = 'api/fitbit/food';
const API_USER_FRIENDS = 'api/fitbit/friends';
const API_USER_HEARTRATE = 'api/fitbit/heartrate';
const API_USER_SLEEP = 'api/fitbit/sleep';
const API_USER_SLEEP_VIEW_DATE = 'api/fitbit/sleep_date';
const API_USER_HEART_VIEW_DATE = 'api/fitbit/heart_date';
const API_USER_FOOD_VIEW_DATE = 'api/fitbit/food_date';
const API_USER_FAT_VIEW_DATE = 'api/fitbit/fat_date';
const API_USER_WEIGHT_VIEW_DATE = 'api/fitbit/weight_date';
const API_USER_BMI_VIEW_DATE = 'api/fitbit/bmi_date';


const API_DELETE_ACCOUNT = 'api/fitbit/delete';
const API_CONFIG = 'api/fitbit/config';

const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class FitbitService {

  private url: string;

  // timeout variables
  private lastUpdateProfile: number;
  private lastUpdateActivity: number;
  private lastUpdateBodyWeight: number;
  private lastUpdateBody_Fat: number;
  private lastUpdateBody_Bmi: number;
  private lastUpdateFood: number;
  private lastUpdateFriends: number;
  private lastUpdateHeartRate: number;
  private lastUpdateSleep: number;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateActivity = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateBodyWeight = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateBody_Fat = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateBody_Bmi = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateFood = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateFriends = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateHeartRate = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateSleep = Date.now() - FIVE_MINUTES_MILLIS;
  }

  /**
   * Get the login dialog.
   * @return{Observable<Object>}: loginDialogUrl data
   */
  getLoginDialog(): Observable<any> {
    const postParams = {
      callbackUrl: environment.fitbitCallbackUrl,
    };
    return this.http.post(`${this.url}${API_LOGIN_DIALOG}`, postParams);
  }

  /**
   * Get the access token.
   * @param authorizationCode: authorization code returned by Fitbit
   * @return{Observable<Object>}: Fitbit user accessToken
   */
  accessToken(authorizationCode: string): Observable<any> {
    const postParams = {
      code: authorizationCode,
      callbackUrl: environment.fitbitCallbackUrl,
    };
    return this.http.post(`${this.url}${API_REQUEST_TOKEN}`, postParams);
  }


  /**
   * Refresh the access token.
   * @param authorizationCode: authorization code returned by Fitbit
   * @return{Observable<Object>}: Fitbit user accessToken
   */
  refreshAccessToken(authorizationCode: string): Observable<any> {
    const postParams = {
      code: authorizationCode,
      callbackUrl: environment.fitbitCallbackUrl,
    };
    return this.http.post(`${this.url}${API_REFRESH_TOKEN}`, postParams);
  }

  /**
   * Get user profile information.
   * @return{Observable<Object>}: Fitbit user profile information if request was sent, false otherwise
   */
  profile(): Observable<any> {
    // timeout
    if (Date.now() - this.lastUpdateProfile >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateProfile = Date.now();
      return this.http.get(`${this.url}${API_USER_PROFILE}`);
    } else {
      return Observable.of(false);
    }
  }

  /**
   * Get user Activity.
   * @return{Observable<Object>}: Fitbit user activity if request was sent, false otherwise
   */
  userActivity(activityToRead?): Observable<any>  {
    // timeout
    if (activityToRead || Date.now() - this.lastUpdateActivity >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update friends
      if (!activityToRead) {
        this.lastUpdateActivity = Date.now();
      }
      const postParams = {
        activityNumber: activityToRead,
      };
      return this.http.post(`${this.url}${API_USER_ACTIVITY}`, postParams);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Body & Weight.
   * @return{Observable<Object>}: Fitbit user body & weight if request was sent, false otherwise
   */
  userBody_Weight(bodyToRead?: number): Observable<any>  {
    // timeout
    if (bodyToRead || Date.now() - this.lastUpdateBodyWeight >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update weight
      if (!bodyToRead) {
        this.lastUpdateBodyWeight = Date.now();
      }
      const postParams = {
        bodyNum: bodyToRead,
      };
      return this.http.post(`${this.url}${API_USER_BODY_WEIGHT}`, postParams);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Weights.
   * @return{Observable<Object>}: Fitbit user weights if request was sent, false otherwise
   */
  userWeightDate(weightsToRead?: number, dateFrom?: Date, dateTo?: Date): Observable<any>  {
    // timeout
    if (weightsToRead || Date.now() - this.lastUpdateBodyWeight >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update weight
      if (!weightsToRead) {
        this.lastUpdateBodyWeight = Date.now();
      }
      const postParams = {
        weightsNumber: weightsToRead,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      return this.http.post(`${this.url}${API_USER_WEIGHT_VIEW_DATE}`, postParams);
    } else {
      return Observable.of(false);
    }
  }



  /**
   * Get user Fats.
   * @return{Observable<Object>}: Fitbit user fats if request was sent, false otherwise
   */
  userFatDate(fatsToRead?: number, dateFrom?: Date, dateTo?: Date): Observable<any>  {
    // timeout
    if (fatsToRead || Date.now() - this.lastUpdateBody_Fat >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update fat
      if (!fatsToRead) {
        this.lastUpdateBody_Fat = Date.now();
      }
      const postParams = {
        fatsNumber: fatsToRead,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      return this.http.post(`${this.url}${API_USER_FAT_VIEW_DATE}`, postParams);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Body & Fat.
   * @return{Observable<Object>}: Fitbit user body & fat if request was sent, false otherwise
   */
  userBody_Fat(fatToRead?: number): Observable<any>  {
    // timeout
    if (fatToRead || Date.now() - this.lastUpdateBody_Fat >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update fat
      if (!fatToRead) {
        this.lastUpdateBody_Fat = Date.now();
      }
      const postParams = {
        fatNum: fatToRead,
      };
      return this.http.post(`${this.url}${API_USER_BODY_FAT}`, postParams);
    } else {
      return Observable.of(false);
    }
  }





  /**
   * Get user Body & Bmi.
   * @return{Observable<Object>}: Fitbit user body & bmi if request was sent, false otherwise
   */
  userBody_Bmi(bmiToRead?: number): Observable<any>  {
    // timeout
    if (bmiToRead || Date.now() - this.lastUpdateBody_Bmi >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update bmi
      if (!bmiToRead) {
        this.lastUpdateBody_Bmi = Date.now();
      }
      const postParams = {
        bmiNum: bmiToRead,
      };
      return this.http.post(`${this.url}${API_USER_BODY_BMI}`, postParams);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user BMI.
   * @return{Observable<Object>}: Fitbit user bmi if request was sent, false otherwise
   */
  userBmiDate(bmisToRead?: number, dateFrom?: Date, dateTo?: Date): Observable<any>  {
    // timeout
    if (bmisToRead || Date.now() - this.lastUpdateBody_Bmi >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update bmi
      if (!bmisToRead) {
        this.lastUpdateBody_Bmi = Date.now();
      }
      const postParams = {
        bmisNumber: bmisToRead,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      return this.http.post(`${this.url}${API_USER_BMI_VIEW_DATE}`, postParams);
    } else {
      return Observable.of(false);
    }
  }



  /**
   * Get user Food.
   * @return{Observable<Object>}: Fitbit user Food if request was sent, false otherwise
   */
  userFood(foodToRead?: number): Observable<any>  {
    // timeout
    if (foodToRead || Date.now() - this.lastUpdateFood >= FIVE_MINUTES_MILLIS) {
      // update the timeout only if user wants update friends
      if (!foodToRead) {
        this.lastUpdateFood = Date.now();
      }
      const postParams = {
        foodNumber: foodToRead,
      };
      return this.http.post(`${this.url}${API_USER_FOOD}`, postParams);
    } else {
      return Observable.of(false);
    }
  }



  /**
   * Get user Foods.
   * @return{Observable<Object>}: Fitbit user foods if request was sent, false otherwise
   */
  userFoodDate(foodToRead?: number, dateFrom?: Date, dateTo?: Date): Observable<any>  {
    // timeout
    if (foodToRead || Date.now() - this.lastUpdateFood >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update food
      if (!foodToRead) {
        this.lastUpdateFood = Date.now();
      }
      const postParams = {
        foodNumber: foodToRead,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      return this.http.post(`${this.url}${API_USER_FOOD_VIEW_DATE}`, postParams);
    } else {
      return Observable.of(false);
    }
  }




  /**
   * Get user Friends.
   * @return{Observable<Object>}: Fitbit user Friends if request was sent, false otherwise
   */
  userFriends(friendsToRead?: number): Observable<any>  {
    // timeout
    if (friendsToRead || Date.now() - this.lastUpdateFriends >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update friends
      if (!friendsToRead) {
        this.lastUpdateFriends = Date.now();
      }
      const postParams = {
        friendsNumber: friendsToRead,
      };
      return this.http.post(`${this.url}${API_USER_FRIENDS}`, postParams);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Heart Rate.
   * @return{Observable<Object>}: Fitbit user Heart Rate if request was sent, false otherwise
   */
  userHeartRate(heartToRead?: number): Observable<any>  {
    // timeout
    if (heartToRead || Date.now() - this.lastUpdateHeartRate >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update heart
      if (!heartToRead) {
        this.lastUpdateHeartRate = Date.now();
      }
      const postParams = {
        heartNumber: heartToRead,
      };
      return this.http.post(`${this.url}${API_USER_HEARTRATE}`, postParams);
    } else {
      return Observable.of(false);
    }
  }



  /**
   * Get user Heart Rate.
   * @return{Observable<Object>}: Fitbit user Heart if request was sent, false otherwise
   */
  userHeartDate(heartToRead?: number, dateFrom?: Date, dateTo?: Date): Observable<any>  {
    // timeout
    if (heartToRead || Date.now() - this.lastUpdateHeartRate >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update heart
      if (!heartToRead) {
        this.lastUpdateHeartRate = Date.now();
      }
      const postParams = {
        heartNumber: heartToRead,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      return this.http.post(`${this.url}${API_USER_HEART_VIEW_DATE}`, postParams);
    } else {
      return Observable.of(false);
    }
  }




  /**
   * Get user Sleep.
   * @return{Observable<Object>}: Fitbit user Sleep if request was sent, false otherwise
   */
  userSleep(sleepToRead?: number): Observable<any>  {
    // timeout
    if (sleepToRead || Date.now() - this.lastUpdateSleep >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update sleep
      if (!sleepToRead) {
        this.lastUpdateSleep = Date.now();
      }
      const postParams = {
        sleepNumber: sleepToRead,
      };
      return this.http.post(`${this.url}${API_USER_SLEEP}`, postParams);
    } else {
      return Observable.of(false);
    }
  }



  /**
   * Get user Sleep.
   * @return{Observable<Object>}: Fitbit user Sleep if request was sent, false otherwise
   */
  userSleepDate(sleepToRead?: number, dateFrom?: Date, dateTo?: Date): Observable<any>  {
    // timeout
    if (sleepToRead || Date.now() - this.lastUpdateSleep >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update friends
      if (!sleepToRead) {
        this.lastUpdateSleep = Date.now();
      }
      const postParams = {
        sleepNumber: sleepToRead,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      return this.http.post(`${this.url}${API_USER_SLEEP_VIEW_DATE}`, postParams);
    } else {
      return Observable.of(false);
    }
  }





  /**
   * Send Fitbit configuration to update.
   * @param option: share options
   * @return {Observable<Object>}
   */
  configuration(option: {shareProfile?: boolean, shareActivity?: boolean, shareBodyWeight?: boolean,
    shareBodyFat?: boolean, shareBodyBmi?: boolean, shareFood?: boolean, shareFriends?: boolean,
    shareHeartRate?: boolean, shareSleep?: boolean}): Observable<any> {
    let params = '?';

    if (!isNullOrUndefined(option.shareProfile)) {
      params += 'shareProfile=' + option.shareProfile + '&';
    }

    if (!isNullOrUndefined(option.shareActivity)) {
      params += 'shareActivity=' + option.shareActivity + '&';
    }

    if (!isNullOrUndefined(option.shareBodyWeight)) {
      params += 'shareBodyWeight=' + option.shareBodyWeight + '&';
    }

    if (!isNullOrUndefined(option.shareBodyFat)) {
      params += 'shareBodyFat=' + option.shareBodyFat + '&';
    }

    if (!isNullOrUndefined(option.shareBodyBmi)) {
      params += 'shareBodyBmi=' + option.shareBodyBmi + '&';
    }

    if (!isNullOrUndefined(option.shareFood)) {
      params += 'shareFood=' + option.shareFood + '&';
    }

    if (!isNullOrUndefined(option.shareFriends)) {
      params += 'shareFriends=' + option.shareFriends + '&';
    }

    if (!isNullOrUndefined(option.shareHeartRate)) {
      params += 'shareHeartRate=' + option.shareHeartRate + '&';
    }

    if (!isNullOrUndefined(option.shareSleep)) {
      params += 'shareSleep=' + option.shareSleep + '&';
    }

    return this.http.get(`${this.url}${API_CONFIG}${params}`);
  }

  /**
   * Delete user Fitbit account.
   * @return {Observable<Object>}
   */
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.url}${API_DELETE_ACCOUNT}`);
  }
}

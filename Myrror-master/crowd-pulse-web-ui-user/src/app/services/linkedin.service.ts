import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const API_LOGIN_DIALOG = 'api/linkedin/login_dialog';
const API_REQUEST_TOKEN = 'api/linkedin/request_token';
const API_USER_PROFILE = 'api/linkedin/profile';
const API_DELETE_ACCOUNT = 'api/linkedin/delete';
const API_CONFIG = 'api/linkedin/config';

const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class LinkedinService {

  private url: string;

  // timeout variables
  private lastUpdateProfile: number;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
  }

  /**
   * Get the login dialog.
   * @return{Observable<Object>}: loginDialogUrl data
   */
  getLoginDialog(): Observable<any> {
    const postParams = {
      callbackUrl: environment.linkedinCallbackUrl,
    };
    return this.http.post(this.url + API_LOGIN_DIALOG, postParams);
  }

  /**
   * Get the access token.
   * @param authorizationCode: authorization code returned by LinkedIn
   * @return{Observable<Object>}: LinkedIn user accessToken
   */
  accessToken(authorizationCode: string): Observable<any> {
    const postParams = {
      code: authorizationCode,
      callbackUrl: environment.linkedinCallbackUrl,
    };
    return this.http.post(this.url + API_REQUEST_TOKEN, postParams);
  }

  /**
   * Get user profile information.
   * @return{Observable<Object>}: LinkedIn user profile information
   */
  userProfile(): Observable<any> {

    // timeout
    if (Date.now() - this.lastUpdateProfile >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateProfile = Date.now();
      return this.http.get(this.url + API_USER_PROFILE);
    } else {
      return Observable.of(false);
    }
  }

  /**
   * Send LinkedIn configuration to update.
   * @param shareProfile: true if the user want to share his LinkedIn profile
   * @return {Observable<Object>}
   */
  configuration(shareProfile: boolean): Observable<any> {
    let params = '?';
    params += 'shareProfile=' + shareProfile;
    return this.http.get(`${this.url}${API_CONFIG}${params}`);
  }

  /**
   * Delete user LinkedIn account.
   * @return {Observable<Object>}
   */
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.url}${API_DELETE_ACCOUNT}`);
  }
}

import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {isNullOrUndefined} from 'util';

const API_REQUEST_TOKEN = 'api/twitter/request_token';
const API_ACCESS_TOKEN = 'api/twitter/access_token';
const API_USER_TIMELINE = 'api/twitter/user_timeline';
const API_USER_PROFILE = 'api/twitter/profile';
const API_DELETE_ACCOUNT = 'api/twitter/delete';
const API_USER_FRIENDS = 'api/twitter/friends';
const API_CONFIG = 'api/twitter/config';

const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class TwitterService {

  private url: string;

  // timeout variables
  private lastUpdateProfile: number;
  private lastUpdateTimeline: number;
  private lastUpdateFriends: number;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateTimeline = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateFriends = Date.now() - FIVE_MINUTES_MILLIS;
  }

  /**
   * Performs the login with Twitter.
   * @return {Observable<Object>}: the redirect URL to authenticate the user (redirectUrl field)
   */
  loginWithTwitter(): Observable<any> {
    const postParam = {
      callback: environment.twitterCallbackUrl,
    };
    return this.http.post(`${this.url}${API_REQUEST_TOKEN}`, postParam);
  }

  /**
   * Get the access token for further request.
   * @param oauthToken: token returned by Twitter after login
   * @param oauthVerifier: verifier string returned by Twitter after login
   * @return {Observable<Object>}: the access token
   */
  accessToken(oauthToken: string, oauthVerifier: string): Observable<any> {
    const postParamas = {
      oauthToken: oauthToken,
      oauthVerifier: oauthVerifier
    };
    return this.http.post(`${this.url}${API_ACCESS_TOKEN}`, postParamas);
  }

  /**
   * Get the access token for further request.
   * @param messagesToRead: the number of messages to retrieve from database. If not specified, update the user messages
   *        with new ones
   * @return {Observable<Object>}: the timeline (Tweets) if request was sent, false otherwise
   */
  timeline(messagesToRead?: Number): Observable<any> {

    // timeout
    if (messagesToRead || Date.now() - this.lastUpdateTimeline >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update tweets
      if (!messagesToRead) {
        this.lastUpdateTimeline = Date.now();
      }

      const postParamas = {
        messages: messagesToRead
      };
      return this.http.post(`${this.url}${API_USER_TIMELINE}`, postParamas);
    } else {
      return Observable.of(false);
    }
  }

  /**
   * Get user Twitter profile.
   * @return {any}: the profile if request was sent, false otherwise
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
   * Get user friends.
   * @param friendsToRead the number of friends to retrieve from database. If not specified, update the user friends
   * @return {Observable<Object>}: Twitter user friends if request was sent, false otherwise
   */
  friends(friendsToRead?: number): Observable<any> {

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
   * Send Twitter configuration to update.
   * @param option: share options
   * @return {Observable<Object>}
   */
  configuration(option: {shareProfile?: boolean, shareMessages?: boolean, shareFriends?: boolean}): Observable<any> {
    let params = '?';

    if (!isNullOrUndefined(option.shareProfile)) {
      params += 'shareProfile=' + option.shareProfile + '&';
    }

    if (!isNullOrUndefined(option.shareMessages)) {
      params += 'shareMessages=' + option.shareMessages + '&';
    }

    if (!isNullOrUndefined(option.shareFriends)) {
      params += 'shareFriends=' + option.shareFriends + '&';
    }

    return this.http.get(`${this.url}${API_CONFIG}${params}`);
  }

  /**
   * Delete user Twitter account.
   * @return {Observable<Object>}
   */
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.url}${API_DELETE_ACCOUNT}`);
  }

}

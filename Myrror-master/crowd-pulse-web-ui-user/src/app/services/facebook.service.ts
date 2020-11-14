import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';

const API_LOGIN_DIALOG = 'api/facebook/login_dialog';
const API_REQUEST_TOKEN = 'api/facebook/request_token';
const API_USER_PROFILE = 'api/facebook/profile';
const API_USER_POSTS = 'api/facebook/posts';
const API_USER_LIKES = 'api/facebook/likes';
const API_USER_FRIENDS = 'api/facebook/friends';
const API_DELETE_ACCOUNT = 'api/facebook/delete';
const API_CONFIG = 'api/facebook/config';

const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class FacebookService {

  private url: string;

  // timeout variables
  private lastUpdateProfile: number;
  private lastUpdatePosts: number;
  private lastUpdateLikes: number;
  private lastUpdateFriends: number;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdatePosts = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateLikes = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateFriends = Date.now() - FIVE_MINUTES_MILLIS;
  }

  /**
   * Get the login dialog.
   * @return{Observable<Object>}: loginDialogUrl data
   */
  getLoginDialog(): Observable<any> {
    const postParams = {
      callbackUrl: environment.facebookCallbackUrl,
    };
    return this.http.post(`${this.url}${API_LOGIN_DIALOG}`, postParams);
  }

  /**
   * Get the access token.
   * @param authorizationCode: authorization code returned by Facebook
   * @return{Observable<Object>}: Facebook user accessToken
   */
  accessToken(authorizationCode: string): Observable<any> {
    const postParams = {
      code: authorizationCode,
      callbackUrl: environment.facebookCallbackUrl,
    };
    return this.http.post(`${this.url}${API_REQUEST_TOKEN}`, postParams);
  }

  /**
   * Get user profile information.
   * @return{Observable<Object>}: Facebook user profile information if request was sent, false otherwise
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
   * Get user posts.
   * @param messagesToRead: the number of messages to retrieve from database. If not specified, update the user messages
   *        with new ones
   * @return{Observable<Object>}: Facebook user posts if request was sent, false otherwise
   */
  userPosts(messagesToRead?: number): Observable<any> {

    // timeout
    if (messagesToRead || Date.now() - this.lastUpdatePosts >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update posts
      if (!messagesToRead) {
        this.lastUpdatePosts = Date.now();
      }
      const postParams = {
        messages: messagesToRead,
      };
      return this.http.post(`${this.url}${API_USER_POSTS}`, postParams);
    } else {
      return Observable.of(false);
    }
  }

  /**
   * Get user likes.
   * @param likesToRead the number of likes to retrieve from database. If not specified, update the user likes
   *        with new ones
   * @param dateFrom
   * @param dateTo
   * @return {Observable<Object>}: Facebook user likes if request was sent, false otherwise
   */
  likes(likesToRead?: number, dateFrom?: Date, dateTo?: Date): Observable<any> {

    // timeout
    if (likesToRead || Date.now() - this.lastUpdateLikes >= FIVE_MINUTES_MILLIS) {

      // update the timeout only if user wants update likes
      if (!likesToRead) {
        this.lastUpdateLikes = Date.now();
      }
      const postParams = {
        likesNumber: likesToRead,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      return this.http.post(`${this.url}${API_USER_LIKES}`, postParams);
    } else {
      return Observable.of(false);
    }
  }

  /**
   * Get user friends.
   * @param friendsToRead the number of friends to retrieve from database. If not specified, update the user friends
   * @return {Observable<Object>}: Facebook user friends if request was sent, false otherwise
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
   * Send Facebook configuration to update.
   * @param option: share options
   * @return {Observable<Object>}
   */
  configuration(option: {shareProfile?: boolean, shareMessages?: boolean, shareFriends?: boolean, shareLikes?: boolean}): Observable<any> {
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

    if (!isNullOrUndefined(option.shareLikes)) {
      params += 'shareLikes=' + option.shareLikes + '&';
    }

    return this.http.get(`${this.url}${API_CONFIG}${params}`);
  }

  /**
   * Delete user Facebook account.
   * @return {Observable<Object>}
   */
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.url}${API_DELETE_ACCOUNT}`);
  }
}

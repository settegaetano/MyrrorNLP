import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

const API_USER_PROFILE = 'api/profile';

@Injectable()
export class ProfileService implements OnDestroy {

  /**
   * Back-end API url.
   */
  private url: string;

  /**
   * The user profile retrieved from Web Service. It can be the current logged user or generic registered user.
   */
  private profile: any;

  /**
   * True if the profile variable contains the current logged user information.
   * @type {boolean}
   */
  private loggedUser = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.url = environment.api;
  }

  /**
   * Get profile information of generic user (logged or not).
   * @param username: the user name
   */
  getProfile(username: string): Promise<any> {
    if (username === this.authService.getUserame()) {
      this.loggedUser = true;
      return this.authService.getUser().then((user) => {
        this.profile = user;
        return Promise.resolve(this.profile);
      });
    } else {
      return Promise.reject(false);
      // TODO remove previous return when back-end API profile is available
      /* TODO uncomment this piece of code
      return this.http.get(`${this.url}${API_USER_PROFILE}/${username}`).toPromise().then(
        (res) => {
          this.profile = res;
          return Promise.resolve(this.profile);
        },
        (err) => {
          return Promise.reject(err);
        }
      );
      */
    }
  }

  /**
   * Get cached profile.
   */
  getCachedProfile() {
    return this.profile;
  }

  /**
   * True if the profile is the logged user.
   * @return {boolean}
   */
  isLoggedUser() {
    return this.loggedUser;
  }

  /**
   * @override
   */
  ngOnDestroy() {
    this.profile = null;
    this.loggedUser = null;
  }


}

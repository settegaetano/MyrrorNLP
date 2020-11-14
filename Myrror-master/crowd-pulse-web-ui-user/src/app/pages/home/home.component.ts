import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';

@Component({
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  /**
   * Status variable. True if login form is on the screen.
   */
  loginForm: boolean;

  /**
   * True if the Sign Up form is for developers.
   */
  developerSignUp: boolean;

  /**
   * APP_ROUTES used in the UI.
   */
  appRoutes = APP_ROUTES;

  /**
   * Status variable.
   */
  authenticated: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = true;
    this.developerSignUp = false;
    this.authenticated = authService.isAuthenticated();
  }

  /**
   * @override
   */
  ngOnInit() {


    // user is authenticated
    if (this.authenticated.value) {

      this.authService.isDeveloper().then(value => {
        if (value) {

          // user is developer
          this.router.navigateByUrl(APP_ROUTES.developer);
        } else {

          // normal user root page
          this.router.navigateByUrl(APP_ROUTES.identities.root);
        }
      });
    }
  }

  /**
   * Shows the login form.
   * @param isLoginForm: value given by the signup component on the 'Login' button
   */
  showLoginForm(isLoginForm) {
    this.loginForm = isLoginForm;
  }

  /**
   * Shows the signup form.
   * @param isLoginForm: value given by the login component on the 'Sign Up' button
   * @param isDeveloper: true if the Sign Up form is for developers
   */
  showSignupForm(isLoginForm, isDeveloper) {
    this.developerSignUp = isDeveloper;
    this.loginForm = !isLoginForm;
  }
}

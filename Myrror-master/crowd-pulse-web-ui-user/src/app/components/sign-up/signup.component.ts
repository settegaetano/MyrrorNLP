import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';

/*
 * From here: https://goo.gl/BCSyfe
 */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Characters accepted
 */
const USERNAME_REGEX = /^([A-Za-z0-9]+)([\w]*)([A-Za-z0-9]+)$/;

@Component({
  selector: 'app-signup',
  styleUrls: ['./signup.component.scss'],
  templateUrl: './signup.component.html',
})
export class SignupComponent {

  // form fields
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  applicationDescription: string;

  @Output() loginForm = new EventEmitter<boolean>();

  @Input() isDeveloper: boolean;

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) {}

  /**
   * Shows the login form.
   */
  showLoginForm() {
    this.loginForm.emit(true);
  }

  /**
   * SignUp.
   */
  signUp() {
    if (!this.checkRequiredFields()) {
      this.toast.warning('Insert the required fields.');
    } else if (!USERNAME_REGEX.test(this.username)) {
      this.toast.warning('Invalid username.');
    } else if (!this.checkParityPassword()) {
      this.toast.warning('Password not match.');
    } else if (!EMAIL_REGEX.test(this.email)) {
      this.toast.warning('Email should be the real one.');
    } else {
      this.authService.signUp(this.email, this.username, this.password, this.applicationDescription).then(
        (res) => {
          this.authService.isDeveloper().then(value => {
            if (value) {
              this.router.navigateByUrl(APP_ROUTES.developer);
            } else {
              this.router.navigateByUrl(APP_ROUTES.identities.root);
            }
          });
        },
        (err) => {
          if (!isNullOrUndefined(err.error.message)) {
            this.toast.error(err.error.message);
          } else {
            this.toast.error('Server error occurred. Try again later.');
          }
        }
      );
    }
  }

  /**
   * @return {boolean}: true if all required fields are given
   */
  private checkRequiredFields(): boolean {
    let result = true;
    if (this.isDeveloper) {
      result = !isNullOrUndefined(this.applicationDescription) && this.applicationDescription !== '';
    }
    return result && !isNullOrUndefined(this.email)
      && !isNullOrUndefined(this.password)
      && !isNullOrUndefined(this.confirmPassword)
      && !isNullOrUndefined(this.username)
      && this.email !== ''
      && this.password !== ''
      && this.confirmPassword !== ''
      && this.username !== '';
  }

  /**
   * @return {boolean}: true if passwords match
   */
  private checkParityPassword(): boolean {
    return this.password === this.confirmPassword;
  }
}

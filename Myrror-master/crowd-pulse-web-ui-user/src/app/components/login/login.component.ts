import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {APP_ROUTES} from '../../app-routes';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  // form fields
  email: string;
  password: string;

  @Output() signupForm = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) {}

  showSignupForm() {
    this.signupForm.emit(true);
  }

  login() {
    if (isNullOrUndefined(this.email)  || isNullOrUndefined(this.password) || this.email === '' || this.password === '') {
      this.toast.warning('Insert the required fields.');
    } else {
      this.authService.authentication(this.email, this.password).then(
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
}

import {Component} from '@angular/core';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';


@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  /**
   * Application name string.
   */
  appName: string;

  /**
   * Navbar links.
   */
  navbarItems = [
    {
      name: 'Identities',
      path: APP_ROUTES.identities.root,
    },
    {
      name: 'Profile',
      path: `${APP_ROUTES.profile.root}/${this.authService.getUserame()}/${APP_ROUTES.profile.data}`,
    },
    {
      name: 'People',
      path: APP_ROUTES.people,
    },
    {
      name: 'Privacy',
      path: APP_ROUTES.privacy,
    },
  ];

  /**
   * True if user is developer.
   */
  isDeveloper = false;

  constructor(
    private authService: AuthService,
    public router: Router,
  ) {
    this.appName = environment.appName;

    this.authService.isDeveloper().then(value => {
      this.isDeveloper = value;
    });
  }

  /**
   * Performs a logout operation.
   */
  logout() {
    this.authService.logout().then(
      (res) => {
        if (res) {

          // go to login page
          this.router.navigateByUrl('');
        }
      }
    );
  }
}

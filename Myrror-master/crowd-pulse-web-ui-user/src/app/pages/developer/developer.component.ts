import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';

@Component({
  styleUrls: ['./developer.component.scss'],
  templateUrl: './developer.component.html'
})
export class DeveloperComponent implements OnInit {

  /**
   * Application name.
   */
  appName = environment.appName;

  /**
   * API URL.
   */
  apiUrl = environment.api;

  /**
   * Developer access token.
   */
  accessToken: string;

  /**
   * The current logged user (developer).
   */
  user: any;

  /**
   * Status variable used in the template to show page content.
   */
  developer = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.getUser().then(user => {
      this.user = user;
      this.accessToken = user.accessToken;
      this.authService.isDeveloper().then(value => {
        this.developer = value;
        if (!value) {

          // normal user root page
          this.router.navigateByUrl(APP_ROUTES.identities.root);
        }
      });
    });
  }
}

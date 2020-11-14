import {Component, OnInit} from '@angular/core';
import {APP_ROUTES} from '../../app-routes';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '../../services/profile.service';

@Component({
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
  providers: [ProfileService],
})
export class ProfileComponent implements OnInit {

  /**
   * Tab menu items.
   */
  profileTabItems = [
    {
      name: 'Profile',
      icon: 'fa fa-list fa-1x',
      path: APP_ROUTES.profile.data
    },
    {
      name: 'Data',
      icon: 'fa fa-bar-chart fa-1x',
      path: APP_ROUTES.profile.stats
    },
    {
      name: 'Settings',
      icon: 'fa fa-cogs fa-1x',
      path: APP_ROUTES.profile.settings
    },
  ];

  /**
   * User image path.
   */
  userImage: string;

  /**
   * The current logged user.
   */
  user: any;

  /**
   * True if the profile data requested are of the current logged user.
   */
  loggedUser = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
  ) {}

  /**
   * @override
   */
  ngOnInit() {
    this.userImage = 'assets/images/user-image.png';

    // reading username from the URL
    this.getUsernameParam().then((username) => {
      this.getUserInfo(username);
    });

  }

  /**
   * Read username from url.
   * @return {Promise<String>}: the username
   */
  private getUsernameParam(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(params => {
        const username = params['username'];
        if (!username) {
          this.router.navigateByUrl(APP_ROUTES.home);
          reject();
        } else {
          resolve(username);
        }
      });
    });
  }

  /**
   * Get user information. If the user is not the current logged one, the getProfile method retrieves the information
   * of the user with specified username in the URL.
   * @param username: the user name
   */
  private getUserInfo(username: string) {
    this.profileService.getProfile(username).then(
      (user) => {
        if (user) {
          this.user = user;
          this.userImage = user.pictureUrl ? user.pictureUrl : 'assets/images/user-image.png';
          this.loggedUser = this.profileService.isLoggedUser();
        } else {
          this.router.navigateByUrl(APP_ROUTES.home);
        }
      },
      (err) => {
        this.router.navigateByUrl(APP_ROUTES.home);
      });
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';

@Component({
  styleUrls: ['./people.component.scss'],
  templateUrl: './people.component.html'
})
export class PeopleComponent implements OnInit {

  /**
   * Application routes used in the UI.
   */
  appRoutes = APP_ROUTES;

  /**
   * Router used in the UI.
   */
  routedPage: Router;

  /**
   * Root page.
   */
  rootPage: string;

  /**
   * Selected sub-page (demographics, interest, etc).
   */
  selected = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  /**
   * @override
   */
  ngOnInit() {
    this.rootPage = `/${APP_ROUTES.people}`;
    this.routedPage = this.router;

    // reading sub-page id
    this.route.queryParams.subscribe(params => {
      const dataId = params['show'];

      if (dataId) {
        this.selected = dataId;
      }
    });
  }

}

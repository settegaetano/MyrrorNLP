import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';
import {ErrorService} from '../../services/error.service';

@Component({
  styleUrls: ['./error.component.scss'],
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  constructor(
    private location: Location,
    private errorService: ErrorService,
    private router: Router,
  ) {}

  ngOnInit() {
    const error = this.errorService.genericError;
    if (error) {
      this.errorService.genericError = false;
    } else {
      this.router.navigateByUrl(APP_ROUTES.home);
    }
  }

  /**
   * Go to the previous page.
   */
  goBack() {
    this.location.back();
  }
}

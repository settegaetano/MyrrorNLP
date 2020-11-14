import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import {APP_ROUTES} from '../app-routes';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  /**
   * @override
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
        if (!this.authService.isAuthenticated().value) {
          this.router.navigate([APP_ROUTES.home]);
          return subscriber.next(false);
        } else {
          this.authService.isDeveloper().then((developer) => {
            if (developer) {
              this.router.navigate([APP_ROUTES.developer]);
              return subscriber.next(true);
            } else {
              return subscriber.next(true);
            }
          });
        }
      }
    );
  }
}

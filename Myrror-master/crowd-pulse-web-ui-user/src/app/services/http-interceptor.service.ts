import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';
import {AuthService} from './auth.service';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../app-routes';
import {ToastrService} from 'ngx-toastr';
import {ErrorService} from './error.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private injector: Injector,
    private toast: ToastrService,
    private errorService: ErrorService,
  ) {}

  /**
   * @override
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService: AuthService = this.injector.get(AuthService);
    const accessToken = authService.getSessionToken();
    let authReq;
    if (!isNullOrUndefined(accessToken)) {
      authReq = req.clone({ headers: req.headers.set('x-access-token', accessToken)});
    } else {
      authReq = req;
    }
    return next.handle(authReq).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do nothing
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          authService.logout();
          this.router.navigateByUrl(APP_ROUTES.home);
          this.toast.error('You are not logged in');
        } else if (err.status !== 409) {

          // generic error page, not 409 for wrong login credentials
          this.errorService.genericError = true;
          this.router.navigateByUrl(APP_ROUTES.error);
        }
      }
    });
  }

}

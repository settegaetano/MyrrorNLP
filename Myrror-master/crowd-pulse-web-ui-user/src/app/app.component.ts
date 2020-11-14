import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  // used to display/hide app bar
  authenticated: any;

  constructor(
    private authService: AuthService,
  ) {
    this.authenticated = authService.isAuthenticated();
  }
}

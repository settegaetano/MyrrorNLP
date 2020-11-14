import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
  MatSidenavModule, MatToolbarModule
} from '@angular/material';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './sign-up/signup.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartModule } from 'angular-highcharts';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { AppRoutingModule } from '../app-routing.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    NavbarComponent,
    SignupComponent,
    InfoDialogComponent,
    ConfirmDialogComponent,
  ],
  exports: [
    LoginComponent,
    NavbarComponent,
    SignupComponent,
    InfoDialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    ChartModule,
  ],
  entryComponents: [
    InfoDialogComponent,
    ConfirmDialogComponent,
  ],
  providers: [
    AuthService,
  ],
})
export class ComponentModule {}

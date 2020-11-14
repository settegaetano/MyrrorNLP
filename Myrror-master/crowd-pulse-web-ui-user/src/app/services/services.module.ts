import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { HttpInterceptorService } from './http-interceptor.service';
import { TwitterService } from './twitter.service';
import { AuthGuardService } from './auth-guard.service';
import { StatsService } from './stats.service';
import { LocalStorageService } from './local-storage.service';
import { FacebookService } from './facebook.service';
import { LinkedinService } from './linkedin.service';
import { AndroidSocketService } from './android-socket.service';
import { ProfileService } from './profile.service';
import { ErrorService } from './error.service';
import {FitbitService} from './fitbit.service';
import {InstagramService} from './instagram.service';
import {TelegramService} from './telegram.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  providers: [
    AuthService,
    HttpInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    TelegramService,
    TwitterService,
    FacebookService,
    LinkedinService,
    InstagramService,
    AndroidSocketService,
    AuthGuardService,
    StatsService,
    LocalStorageService,
    ErrorService,
    FitbitService,
  ],
})
export class ServicesModule {}

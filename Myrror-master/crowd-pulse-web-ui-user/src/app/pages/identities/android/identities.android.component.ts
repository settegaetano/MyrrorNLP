import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AndroidSocketService} from '../../../services/android-socket.service';
import {MatDialog} from '@angular/material';
import {InfoDialogComponent} from '../../../components/info-dialog/info-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from "@angular/router";

@Component({
  styleUrls: ['./identities.android.component.scss'],
  templateUrl: './identities.android.component.html'
})
export class IdentitiesAndroidComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * Current device ID selected.
   */
  selectedDeviceId: string;

  /**
   *Device config for the device selected.
   */
  selectedDeviceConfig: any;

  /**
   * Status variable.
   */
  loginSuccess: boolean;

  constructor(
    private authService: AuthService,
    private androidSocketService: AndroidSocketService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private route: ActivatedRoute,
  ) {}

  /**
   * @override
   */
  ngOnInit() {

    // get user info
    this.authService.getUser().then(
      (user) => {
        if (user) {
          this.user = user;

          // set socket callback
          this.androidSocketService.loginResponse(this.socketLoginCallback, this);
          this.androidSocketService.readConfig(this.socketConfigCallback, this);
          this.androidSocketService.sendDataResponse(this.socketSendDataCallback, this);

          // reading device ID
          this.route.queryParams.subscribe(params => {
            const deviceId = params['deviceId'];
            if (deviceId) {
              this.selectedDeviceId = deviceId;
              this.onDeviceIdSelected();
            }
          });
        }
      });
  }

  /**
   * Triggered when user selects a device ID.
   */
  onDeviceIdSelected() {
    const configs = this.user.identities.configs.devicesConfig;
    if (configs && configs.length > 0) {
      for (let i = 0; i < configs.length; i++) {
        if (configs[i].deviceId === this.selectedDeviceId) {
          this.selectedDeviceConfig = configs[i];
          this.socketLogin();
          this.refactorConfigObject();
          return;
        }
      }
    }
    this.selectedDeviceConfig = null;
  }

  /**
   * Send new configuration to the server.
   */
  sendConfiguration() {
    this.androidSocketService.updateConfig(this.restoreConfigObject());
  }

  /**
   * Get data from device.
   */
  getDataFromDevice() {
    if (!this.androidSocketService.getData(this.selectedDeviceId, this.user.username)) {
      this.toast.warning('Timeout not elapsed. Retry in about five minutes');
    }
  }

  /**
   * Binary search algorithm: find the selected element in the valueAllowed list. If the element is not in the list,
   * the value immediately lower than it in the list will be chosen.
   * @param config: config element for a specified data source (with id, info, read, time, share, sliderOptions fields)
   */
  onSliderMoved(config: any) {
    const valueAllowed = config.sliderOptions.valueAllowed;
    let startPosition = 0;
    let endPosition = valueAllowed.length - 1;
    let found = false;
    while (!found) {
      const midPosition = startPosition + Math.floor((endPosition - startPosition) / 2);
      const midValue = valueAllowed[midPosition];
      if (config.time === midValue) {
        found = true;
      } else if (config.time < midValue) {
        endPosition = midPosition - 1;
      } else {
        startPosition = midPosition + 1;
      }
      if (!found && endPosition - startPosition <= 0) {
        config.time = valueAllowed[startPosition];
        found = true;
      }
    }
  }

  /**
   * Open a dialog with information about data source.
   * @param info: the info message
   */
  openInfoDialog(info: string) {
    this.dialog.open(InfoDialogComponent, {
      data: {infoText: info},
    });
  }

  /**
   * Change the config object structure to a more consistent and easy to manage in the UI.
   */
  refactorConfigObject() {
    if (this.selectedDeviceConfig) {
      this.selectedDeviceConfig = [
        {
          id: 'Mobile Application Accounts',
          info: 'Accounts data are user\'s accounts information (application package and user name) ' +
          'stored in the smartphone.',
          read: this.selectedDeviceConfig.readAccounts == 1,
          time: parseInt(this.selectedDeviceConfig.timeReadAccounts, 10) / (3600 * 1000),
          share: this.selectedDeviceConfig.shareAccounts == 1,
          sliderOptions: {
            valueAllowed: [1, 2, 3, 4, 6, 8, 12, 24],
            format: 'hours',
          }
        },
        {
          id: 'User Activities',
          info: 'User activity (running, walking, etc).',
          read: this.selectedDeviceConfig.readActivity == 1,
          time: parseInt(this.selectedDeviceConfig.timeReadActivity, 10) / (60 * 1000),
          share: this.selectedDeviceConfig.shareActivity == 1,
          sliderOptions: {
            valueAllowed: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
            format: 'minutes',
          },
        },
        {
          id: 'App Usage',
          info: 'Information about the applications installed on the device.',
          read: this.selectedDeviceConfig.readAppInfo == 1,
          time: this.selectedDeviceConfig.timeReadAppInfo,
          share: this.selectedDeviceConfig.shareAppInfo == 1,
          sliderOptions: null,
        },
        {
          id: 'Contacts',
          info: 'User\'s contacts information stored in the smartphone (with phone numbers).',
          read: this.selectedDeviceConfig.readContact == 1,
          time: parseInt(this.selectedDeviceConfig.timeReadContact, 10) / (3600 * 1000),
          share: this.selectedDeviceConfig.shareContact == 1,
          sliderOptions: {
            valueAllowed: [1, 2, 3, 4, 6, 8, 12, 24],
            format: 'hours',
          },
        },
        {
          id: 'Display Statistics',
          info: 'On/Off display total time.',
          read: this.selectedDeviceConfig.readDisplay == 1,
          time: this.selectedDeviceConfig.timeReadDisplay,
          share: this.selectedDeviceConfig.shareDisplay == 1,
          sliderOptions: null,
        },
        {
          id: 'GPS',
          info: 'GPS data is the user position in terms of latitude and longitude.',
          read: this.selectedDeviceConfig.readGPS == 1,
          time: parseInt(this.selectedDeviceConfig.timeReadGPS, 10) / (60 * 1000),
          share: this.selectedDeviceConfig.shareGPS == 1,
          sliderOptions: {
            valueAllowed: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
            format: 'minutes',
          },
        },
        {
          id: 'Network Statistics',
          info: 'Network traffic statistics in terms of bytes transmitted and received ' +
          'over mobile net and Wifi.\nThese statistics may not be available on all platforms.',
          read: this.selectedDeviceConfig.readNetStats == 1,
          time: parseInt(this.selectedDeviceConfig.timeReadNetStats, 10) / (3600 * 1000),
          share: this.selectedDeviceConfig.shareNetStats == 1,
          sliderOptions: {
            valueAllowed: [1, 2, 3, 4, 6, 8, 12, 24],
            format: 'hours',
          },
        },
      ];
    }
  }

  /**
   * Performs a socket login.
   */
  private socketLogin() {
    this.androidSocketService.login(this.user.email, this.user.password, this.selectedDeviceId);
  }

  /**
   * Socket login callback.
   * @param response: socket response
   * @param currentComponent: this component reference (IdentitiesAndroidComponent)
   */
  private socketLoginCallback(response, currentComponent) {
    currentComponent.loginSuccess = response.code === 1;
  }

  /**
   * Socket config callback (triggered when config is updated).
   * @param response: socket response
   * @param currentComponent: this component reference (IdentitiesAndroidComponent)
   */
  private socketConfigCallback(response, currentComponent) {
    if (response.code === 1 && response.config.deviceId === currentComponent.selectedDeviceId) {
      currentComponent.selectedDeviceConfig = response.config;
      currentComponent.refactorConfigObject();
      currentComponent.toast.success(response.description);
    } else if (response.config.deviceId === currentComponent.selectedDeviceId) {
      currentComponent.toast.success(response.description);
    }
  }

  /**
   * Socket getData callback.
   * @param response: socket response
   * @param currentComponent: this component reference (IdentitiesAndroidComponent)
   */
  private socketSendDataCallback(response, currentComponent) {
    if (response.code === 2) {
      currentComponent.toast.success(response.description);
    }
  }

  /**
   * Restore config object to send back to server.
   * @return: restored config object
   */
  private restoreConfigObject(): any {
    if (this.selectedDeviceConfig) {
      const deviceConfigToSend = {
        deviceId: null,
        readGPS: null,
        readContact: null,
        readAccounts: null,
        readAppInfo: null,
        readNetStats: null,
        readDisplay: null,
        readActivity: null,
        shareGPS: null,
        shareContact: null,
        shareAccounts: null,
        shareAppInfo: null,
        shareNetStats: null,
        shareDisplay: null,
        shareActivity: null,
        timeReadGPS: null,
        timeReadContact: null,
        timeReadAccounts: null,
        timeReadAppInfo: null,
        timeReadNetStats: null,
        timeReadActivity: null
      };
      for (const config of this.selectedDeviceConfig) {
        switch (config.id) {
          case 'Mobile Application Accounts':
            deviceConfigToSend.readAccounts = config.read ? '1' : '0';
            deviceConfigToSend.shareAccounts = config.share ? '1' : '0';
            deviceConfigToSend.timeReadAccounts = config.time * (3600 * 1000);
            break;
          case 'User Activities':
            deviceConfigToSend.readActivity = config.read ? '1' : '0';
            deviceConfigToSend.shareActivity = config.share ? '1' : '0';
            deviceConfigToSend.timeReadActivity = config.time * (60 * 1000);
            break;
          case 'App Usage':
            deviceConfigToSend.readAppInfo = config.read ? '1' : '0';
            deviceConfigToSend.shareAppInfo = config.share ? '1' : '0';
            deviceConfigToSend.timeReadAppInfo = config.time;
            break;
          case 'Contacts':
            deviceConfigToSend.readContact = config.read ? '1' : '0';
            deviceConfigToSend.shareContact = config.share ? '1' : '0';
            deviceConfigToSend.timeReadContact = config.time * (3600 * 1000);
            break;
          case 'Display Statistics':
            deviceConfigToSend.readDisplay = config.read ? '1' : '0';
            deviceConfigToSend.shareDisplay = config.share ? '1' : '0';
            break;
          case 'GPS':
            deviceConfigToSend.readGPS = config.read ? '1' : '0';
            deviceConfigToSend.shareGPS = config.share ? '1' : '0';
            deviceConfigToSend.timeReadGPS = config.time * (60 * 1000);
            break;
          case 'Network Statistics':
            deviceConfigToSend.readNetStats = config.read ? '1' : '0';
            deviceConfigToSend.shareNetStats = config.share ? '1' : '0';
            deviceConfigToSend.timeReadNetStats = config.time * (3600 * 1000);
            break;
        }
      }
      deviceConfigToSend.deviceId = this.selectedDeviceId;
      return deviceConfigToSend;
    }
  }

}

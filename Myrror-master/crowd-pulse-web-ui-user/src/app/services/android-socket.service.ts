import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';

const SOCKET_LOGIN = 'login';
const SOCKET_CONFIG = 'config';
const SOCKET_SEND_DATA = 'send_data';

const CLIENT = 'web-ui';
const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class AndroidSocketService {

  /**
   * SocketIo instance.
   */
  private socket: any;

  /**
   * Last getData request. Used to deny multiple request to the server.
   */
  private lastSendDataRequest: number;

  constructor() {
    this.socket = io(environment.socket);
    this.lastSendDataRequest = Date.now() - FIVE_MINUTES_MILLIS;
  }

  /**
   * Performs a socket login.
   * @param email: the user email
   * @param password: the user password
   * @param deviceId: the device ID
   */
  login(email: string, password: string, deviceId: string) {
    const loginData = {
      email: email,
      password: password,
      deviceId: deviceId,
      client: CLIENT,
    };

    this.socket.emit(SOCKET_LOGIN, loginData);
  }

  /**
   * Socket login response.
   * @param callback: socket callback
   * @param component: component that handle the response
   */
  loginResponse(callback: any, component) {
    this.socket.on(SOCKET_LOGIN, function (data) {
      callback(data, component);
    }.bind(component));
  }

  /**
   * Socket config response.
   * @param callback: socket callback
   * @param component: component that handle the response
   */
  readConfig(callback: any, component) {
    this.socket.on(SOCKET_CONFIG, function (data) {
      callback(data, component);
    }.bind(component));
  }

  /**
   * Socket getData response.
   * @param callback: socket callback
   * @param component: component that handle the response
   */
  sendDataResponse(callback: any, component) {
    this.socket.on(SOCKET_SEND_DATA, function (data) {
      callback(data, component);
    }.bind(component));
  }

  /**
   * Update configuration.
   * @param config: the device configuration to update
   */
  updateConfig(config: any) {

    // append meta-info about the client
    config.client = CLIENT;

    this.socket.emit(SOCKET_CONFIG, config);
  }

  /**
   * Get data from the device.
   * @param deviceId: the user device Id
   * @param username: the user name
   * @return {boolean}: true if the request was sent
   */
  getData(deviceId: string, username: string): boolean {

    // timeout
    if (Date.now() - this.lastSendDataRequest >= FIVE_MINUTES_MILLIS) {
      this.lastSendDataRequest = Date.now();
      const data = {
        deviceId: deviceId,
        username: username,
        client: CLIENT
      };
      this.socket.emit(SOCKET_SEND_DATA, data);
      return true;
    } else {
      return false;
    }
  }

}

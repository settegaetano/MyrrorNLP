import {Injectable} from '@angular/core';

@Injectable()
export class ErrorService {

  /**
   * Generic error status variable.
   */
  private _genericError = false;

  get genericError(): boolean {
    return this._genericError;
  }

  set genericError(value: boolean) {
    this._genericError = value;
  }

}

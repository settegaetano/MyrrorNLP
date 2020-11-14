import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class LocalStorageService {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  /**
   * LocalStorage setItem method.
   * @param key: the object key
   * @param value: the object value
   */
  setItem(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * LocalStorage getItem method.
   * @param key: the object key
   * @return {any}: the object value
   */
  getItem(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(key));
    }
  }

  /**
   * LocalStorage removeItem method.
   * @param key: the object key
   */
  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

}

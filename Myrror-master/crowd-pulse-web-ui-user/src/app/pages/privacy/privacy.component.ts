import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  styleUrls: [],
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent {

  constructor(
    private location: Location,
  ) {}

  /**
   * Go to the previous page.
   */
  goBack() {
    this.location.back();
  }
}

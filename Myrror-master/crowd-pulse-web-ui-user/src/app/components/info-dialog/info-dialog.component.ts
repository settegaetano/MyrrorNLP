import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-info-dialog',
  styleUrls: ['./info-dialog.component.scss'],
  templateUrl: './info-dialog.component.html',

})
export class InfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

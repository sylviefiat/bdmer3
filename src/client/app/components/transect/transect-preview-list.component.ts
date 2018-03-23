import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Transect, Zone, Platform } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-transect-preview-list',
  template: `
    <bc-transect-preview *ngFor="let transect of (transects$ | async)" [transect]="transect" [zone]="zone" [platform]="platform"></bc-transect-preview>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `,
  ],
})
export class TransectPreviewListComponent {
  @Input() transects$: Observable<Transect[]>;
  @Input() zone: Zone;
  @Input() platform: Platform;
}

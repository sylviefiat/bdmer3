import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Station, Zone, Platform } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-station-preview-list',
  template: `
    <bc-station-preview *ngFor="let station of (stations$ | async)" [station]="station" [zone]="zone" [platform]="platform"></bc-station-preview>
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
export class StationPreviewListComponent {
  @Input() stations$: Observable<Station[]>;
  @Input() zone: Zone;
  @Input() platform: Platform;
}

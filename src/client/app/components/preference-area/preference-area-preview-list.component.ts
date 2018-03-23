import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZonePreference, Zone, Platform } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-zone-preference-preview-list',
  template: `
    <bc-zone-preference-preview *ngFor="let zonePref of (zonesPref$ | async)" [zonePref]="zonePref" [zone]="zone" [platform]="platform"></bc-zone-preference-preview>
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
export class PreferenceAreaPreviewListComponent {
  @Input() zonesPref$: Observable<ZonePreference[]>;
  @Input() zone: Zone;
  @Input() platform: Platform;
}

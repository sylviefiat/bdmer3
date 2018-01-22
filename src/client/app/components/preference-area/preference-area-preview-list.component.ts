import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { ZonePreference, Zone, Site } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-zone-preference-preview-list',
  template: `
    <bc-zone-preference-preview *ngFor="let zonePref of zonePrefs" [zonePref]="zonePref" [zone]="zone" [site]="site"></bc-zone-preference-preview>
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
  @Input() zonesPref: ZonePreference[];
  @Input() zone: Zone;
  @Input() site: Site;
}

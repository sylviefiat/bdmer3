import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Transect, Zone, Site } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-transect-preview-list',
  template: `
    <bc-transect-preview *ngFor="let transect of transects" [transect]="transect" [zone]="zone" [site]="site"></bc-transect-preview>
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
  @Input() transects: Transect[];
  @Input() zone: Zone;
  @Input() site: Site;
}

import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Campaign, Zone, Site, Count } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-count-preview-list',
  template: `
    <bc-count-preview *ngFor="let count of counts" [count]="count" [campaign]="campaign" [zone]="zone" [site]="site"></bc-count-preview>
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
export class CountPreviewListComponent {
  @Input() counts: Count[];
  @Input() campaign: Campaign;
  @Input() zone: Zone;
  @Input() site: Site;
}

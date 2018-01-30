import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Campaign, Zone, Site } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-campaign-preview-list',
  template: `
    <bc-campaign-preview *ngFor="let campaign of campaigns" [campaign]="campaign" [zone]="zone" [site]="site"></bc-campaign-preview>
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
export class CampaignPreviewListComponent {
  @Input() campaigns: Campaign[];
  @Input() zone: Zone;
  @Input() site: Site;
}

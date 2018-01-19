import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Site } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-site-preview-list',
  template: `
    <bc-site-preview *ngFor="let site of sites" [site]="site"></bc-site-preview>
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
export class SitePreviewListComponent {
  @Input() sites: any;
}

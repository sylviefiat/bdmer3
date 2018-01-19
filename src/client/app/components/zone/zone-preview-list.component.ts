import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Zone } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-zone-preview-list',
  template: `
    <bc-zone-preview *ngFor="let zone of zones" [zone]="zone" [idSite]="idSite"></bc-zone-preview>
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
export class ZonePreviewListComponent {
  @Input() zones: any;
  @Input() idSite: any;
}

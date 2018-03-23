import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Zone } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-zone-preview-list',
  template: `
    <bc-zone-preview *ngFor="let zone of (zones$ | async)" [zone]="zone" [idPlatform]="idPlatform"></bc-zone-preview>
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
  @Input() zones$: Observable<Zone[]>;
  @Input() idPlatform: string;
}

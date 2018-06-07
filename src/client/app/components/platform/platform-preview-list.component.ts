import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Platform } from './../../modules/datas/models/platform';
import { Observable } from 'rxjs';

@Component({
  selector: 'bc-platform-preview-list',
  template: `
    <bc-platform-preview *ngFor="let platform of (platforms$ | async)" [platform]="platform"></bc-platform-preview>
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
export class PlatformPreviewListComponent {
  @Input() platforms$: Observable<Platform>;
}

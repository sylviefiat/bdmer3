import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Site } from './../../modules/datas/models/site';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'bc-site-preview-list',
  template: `
    <bc-site-preview *ngFor="let site of (sites$ | async)" [site]="site"></bc-site-preview>
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
  @Input() sites$: Observable<Site>;
}

import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Campaign, Zone, Site, Count } from './../../modules/datas/models/site';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IAppState, getLangues } from './../../modules/ngrx/index';

@Component({
  selector: 'bc-count-preview-list',
  template: `
    <bc-count-preview *ngFor="let count of counts" [count]="count" [campaign]="campaign" [site]="site" [locale]="locale$ | async"></bc-count-preview>
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
export class CountPreviewListComponent implements OnInit {
  @Input() counts: Count[];
  @Input() campaign: Campaign;
  @Input() site: Site;
  locale$: Observable<string>;

  constructor(private store: Store<IAppState>) {

  }
  ngOnInit() {
    this.locale$ = this.store.let(getLangues);
  }
}

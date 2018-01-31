import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Campaign, Zone, Site } from './../../modules/datas/models/site';
import { IAppState,getLangues } from './../../modules/ngrx/index';

@Component({
  selector: 'bc-campaign-preview-list',
  template: `
    <bc-campaign-preview *ngFor="let campaign of campaigns" [campaign]="campaign" [zone]="zone" [site]="site" [locale]="locale$ | async"></bc-campaign-preview>
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
export class CampaignPreviewListComponent implements OnInit {
  @Input() campaigns: Campaign[];
  @Input() zone: Zone;
  @Input() site: Site;
  locale$: Observable<string>;

  constructor(private store: Store<IAppState>){
    
  }

  ngOnInit() {
    this.locale$ = this.store.let(getLangues);
  }
}

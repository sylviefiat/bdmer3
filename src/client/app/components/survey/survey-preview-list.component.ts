import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Survey, Zone, Platform } from './../../modules/datas/models/platform';
import { IAppState,getLangues } from './../../modules/ngrx/index';

@Component({
  selector: 'bc-survey-preview-list',
  template: `
    <bc-survey-preview *ngFor="let survey of (surveys$ | async)" [survey]="survey" [platform]="platform" [locale]="locale$ | async"></bc-survey-preview>
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
export class SurveyPreviewListComponent implements OnInit {
  @Input() surveys$: Observable<Survey[]>;
  @Input() platform: Platform;
  locale$: Observable<string>;

  constructor(private store: Store<IAppState>){
    
  }

  ngOnInit() {
    this.locale$ = this.store.select(getLangues);
  }
}

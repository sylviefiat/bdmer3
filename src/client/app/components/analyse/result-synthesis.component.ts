
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { Results } from '../../modules/analyse/models/index';

@Component({
  selector: 'bc-result-synthesis',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
   <h2>{{ results.name }}</h2>
  `,
  styles: [
  `
    
  `]
})
export class ResultSynthesisComponent implements OnInit {
  @Input() results: Results;
  @Input() locale: string;

  constructor() {

  }

  ngOnInit() {
    console.log(this.results);
  }

  get localDate() {
    switch (this.locale) {
      case "fr":
        return 'dd-MM-yyyy';
      case "en":
      default:
        return 'MM-dd-yyyy';
    }
  }


}

import { Component, Input, AfterViewChecked } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';

import { Country } from './../../modules/countries/models/country';
import { Store } from '@ngrx/store';
import { IAppState } from '../../modules/ngrx/index';

@Component({
  moduleId: module.id,
  selector: 'bc-data',
  templateUrl: 'management.component.html',
  styleUrls: [
    'management.component.css',
  ],
})
export class ManagementComponent implements AfterViewChecked {
   @Input() country: Country;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {
   
  }

 ngAfterViewChecked() {  
     //console.log(this.country);
 }

 get isCountryOk(){
     return this.country && this.country.code!='AA'
 }

 newSpeciesForm() {
    this.routerext.navigate(['/newSpeciesForm'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }

 newSpeciesImport() {
    this.routerext.navigate(['/newSpeciesImport'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }

 editSpecies() {
    this.routerext.navigate(['/editSpecies'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}

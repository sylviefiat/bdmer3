import { Component, Input, AfterViewChecked } from '@angular/core';
import { Country } from './../../modules/countries/models/country';

@Component({
  selector: 'bc-country-preview-list',
  template: `
    <bc-country-preview *ngFor="let country of countries" [country]="country"></bc-country-preview>
  
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
export class CountryPreviewListComponent implements AfterViewChecked {
  @Input() countries: Country[];

  ngAfterViewChecked() {     
    //console.log(this.countries);   
  }

  get pays() {
    return this.countries;
  }
}

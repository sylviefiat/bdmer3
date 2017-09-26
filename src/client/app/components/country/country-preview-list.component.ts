import { Component, Input } from '@angular/core';
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
export class CountryPreviewListComponent {
  @Input() countries: Country[];

  constructor() {
    //console.log(this.countries)
  }
}

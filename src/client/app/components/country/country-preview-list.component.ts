import { Component, OnInit, Input } from '@angular/core';
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
export class CountryPreviewListComponent implements OnInit {
  @Input() countries: Country[];

  ngOnInit() {     
    this.countries = this.countries.sort((c1,c2) => (c1.name<c2.name)?-1:((c1.name>c2.name)?1:0));
  }
}

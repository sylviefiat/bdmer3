import { Component, Input } from '@angular/core';
import { Species } from './../../modules/datas/models/species';

@Component({
  selector: 'bc-species-preview-list',
  template: `
    <bc-species-preview *ngFor="let species of speciesList" [species]="species"></bc-species-preview>
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
export class SpeciesPreviewListComponent {
  @Input() speciesList: Species[];
 
}

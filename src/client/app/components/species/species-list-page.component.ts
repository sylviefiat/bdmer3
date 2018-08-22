import "rxjs/add/operator/let";
import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { RouterExtensions, Config } from "../../modules/core/index";
import { getSpeciesPageMsg } from "../../modules/ngrx/index";

import { IAppState, getSpeciesInApp } from "../../modules/ngrx/index";
import { SpeciesAction } from "../../modules/datas/actions/index";
import { Species } from "../../modules/datas/models/species";

@Component({
  selector: "bc-species-page",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>{{ 'SPECIES_LIST' | translate}}</mat-card-title>
      <mat-form-field>
      <mat-select  placeholder="{{'ADD_SPECIES' | translate}}" (selectionChange)="addSpecies($event.value)">
          <mat-option [value]="'form'">{{ 'FORM' | translate}}</mat-option>
          <mat-option [value]="'import'">{{ 'IMPORT' | translate}}</mat-option>
      </mat-select>
      </mat-form-field>
      <mat-card-content class="msg" *ngIf="msg$ | async" align="start">{{ (msg$ | async) | translate }}</mat-card-content>
    </mat-card>

    <bc-species-preview-list [speciesList]="species$ | async"></bc-species-preview-list>

  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [
    `
      mat-card {
        text-align: center;
      }
      mat-card-title {
        display: flex;
        justify-content: center;
      }
      .msg {
        text-align: center;
        padding: 16px;
        color: white;
        background-color: #4bb543;
      }
    `
  ]
})
export class SpeciesListPageComponent implements OnInit {
  species$: Observable<Species[]>;
  msg$: Observable<string | null>;
  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.species$ = this.store.select(getSpeciesInApp);
    this.msg$ = this.store.select(getSpeciesPageMsg);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  addSpecies(type: string) {
    type = type.charAt(0).toUpperCase() + type.slice(1);
    this.routerext.navigate(["/species" + type]);
  }
}

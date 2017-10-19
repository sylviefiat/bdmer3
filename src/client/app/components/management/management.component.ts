import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Country } from './../../modules/countries/models/country';
import { Species } from './../../modules/datas/models/species';
import { SpeciesAction } from '../../modules/datas/actions/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

@Component({
    moduleId: module.id,
    selector: 'bc-data',
    templateUrl: 'management.component.html',
    styleUrls: [
        'management.component.css',
    ],
})
export class ManagementComponent implements OnInit {
    @Input() country: Country;
    speciesList$: Observable<Species[]>;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {

    }

    ngOnInit() {
        this.speciesList$ = this.store.let(getSpeciesInApp);
        this.store.dispatch(new SpeciesAction.LoadAction());
    }

    get isCountryOk() {
        return this.country && this.country.code != 'AA'
    }

    newSpeciesForm() {
        this.routerext.navigate(['/speciesForm'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

    newSpeciesImport() {
        this.routerext.navigate(['/speciesImport'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

    editSpecies(species: Species) {
        this.routerext.navigate(['/species/'+species._id], {
        //this.routerext.navigate(['/speciesForm/'+species._id], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}

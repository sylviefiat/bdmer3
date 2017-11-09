import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Country } from './../../modules/countries/models/country';
import { Species, Site, Zone } from './../../modules/datas/models/index';
import { SpeciesAction, SiteAction } from '../../modules/datas/actions/index';

import { IAppState, getSpeciesInApp, getSiteListCurrentCountry } from '../../modules/ngrx/index';

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
    siteList$: Observable<Site[]>;
    zoneList$: Observable<Zone[]>;
    species: Species;
    site: Site;
    zone: Zone;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {

    }

    ngOnInit() {
        this.speciesList$ = this.store.let(getSpeciesInApp);
        this.siteList$ = this.store.let(getSiteListCurrentCountry);
        this.store.dispatch(new SpeciesAction.LoadAction());
    }

    get isCountryOk() {
        return this.country && this.country.code != 'AA';
    }

    newSpeciesForm() {
        this.routerext.navigate(['/speciesForm']);
    }

    newSpeciesImport() {
        this.routerext.navigate(['/speciesImport']);
    }

    editSpecies() {
        console.log(this.species);
        this.routerext.navigate(['/speciesForm/' + this.species._id]);
    }

    newSiteForm() {
        this.routerext.navigate(['/siteForm']);
    }

    newSiteImport() {
        this.routerext.navigate(['/siteImport']);
    }

    editSite() {
        console.log(this.site);
        this.routerext.navigate(['/siteForm/' + this.site._id]);
    }

    loadZone() {
        this.store.dispatch(new SiteAction.SelectAction(this.site._id));
        console.log(this.site);
        this.zoneList$ = of(this.site.zones);
    }

    addZone() {
        console.log(this.site);
        this.routerext.navigate(['/zoneForm/' + this.site._id], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    importZone() {
        this.routerext.navigate(['/zoneImport/' + this.site._id], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    editZone() {
        console.log("edit !");
        this.routerext.navigate(['/zoneForm/' + this.site._id + "/" + this.zone.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }
}

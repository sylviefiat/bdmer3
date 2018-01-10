import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Country } from './../../modules/countries/models/country';
import { Species, Site, Zone, Transect, ZonePreference, Count } from './../../modules/datas/models/index';
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
    transectList$: Observable<Transect[]>;
    zonePrefList$: Observable<ZonePreference[]>;
    countList$: Observable<Count[]>;
    species: Species;
    site: Site;
    zone: Zone;
    transect: Transect;
    zonePreference: ZonePreference;
    count: Count;

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

    viewSpecies() {
        this.routerext.navigate(['/species/' + this.species._id]);
    }

    editSpecies() {
        this.routerext.navigate(['/speciesForm/' + this.species._id]);
    }

    newSiteForm() {
        this.routerext.navigate(['/siteForm']);
    }

    newSiteImport() {
        this.routerext.navigate(['/siteImport']);
    }

    viewSite() {
        this.routerext.navigate(['/site/' + this.site._id]);
    }

    editSite() {
        this.routerext.navigate(['/siteForm/' + this.site._id]);
    }

    loadZone() {
        this.store.dispatch(new SiteAction.SelectSiteAction(this.site._id));
        this.zoneList$ = of(this.site.zones);
    }

    addZone() {
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

    viewZone() {
        this.routerext.navigate(['/zone/' + this.site._id + "/" + this.zone.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    editZone() {
        this.routerext.navigate(['/zoneForm/' + this.site._id + "/" + this.zone.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    loadTransect() {
        this.store.dispatch(new SiteAction.SelectZoneAction(this.zone.code));
        console.log(this.zone);
        this.transectList$ = of(this.zone.transects);
    }

    addTransect() {
        console.log(this.site._id);
        this.routerext.navigate(['/transectForm/' + this.site._id + "/" + this.zone.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    importTransect() {
        this.routerext.navigate(['/transectImport/' + this.site._id + "/" + this.zone.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    viewTransect() {
        this.routerext.navigate(['/transect/' + this.site._id + "/" + this.zone.code + "/" + this.transect.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    editTransect() {
        this.routerext.navigate(['/transectForm/' + this.site._id + "/" + this.zone.code + "/" + this.transect.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    loadZonePref() {
        this.store.dispatch(new SiteAction.SelectSpPrefAction(this.zone.code));
        this.zonePrefList$ = of(this.zone.zonePreferences);
    }

    addZonePref() {
        this.routerext.navigate(['/zonePreferenceForm/' + this.site._id + "/" + this.zone.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    importZonePref() {
        this.routerext.navigate(['/zonePreferenceImport/' + this.site._id + "/" + this.zone.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    viewZonePref() {
        this.routerext.navigate(['/zonePreference/' + this.site._id + "/" + this.zone.code + "/" + this.zonePreference.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    editZonePref() {
        this.routerext.navigate(['/zonePreferenceForm/' + this.site._id + "/" + this.zone.code + "/" + this.zonePreference.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    loadCount() {
        this.store.dispatch(new SiteAction.SelectTransectAction(this.transect.code));
        this.countList$ = of(this.transect.counts);
    }

    addCount() {
        this.routerext.navigate(['/countForm/' + this.site._id + "/" + this.zone.code + "/" + this.transect.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    importCount() {
        this.routerext.navigate(['/countImport/' + this.site._id + "/" + this.zone.code + "/" + this.transect.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    viewCount() {
        this.routerext.navigate(['/count/' + this.site._id + "/" + this.zone.code + "/" + this.transect.code + "/" + this.count.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }

    editCount() {
        this.routerext.navigate(['/countForm/' + this.site._id + "/" + this.zone.code + "/" + this.transect.code + "/" + this.count.code], {
            transition: {
                duration: 800,
                name: 'slideTop',
            }
        });
    }
}

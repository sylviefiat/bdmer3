import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Zone, Transect, ZonePreference, Campaign } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone',
    templateUrl: 'view-zone.component.html',
    styleUrls: [
        'view-zone.component.css',
    ],
})
export class ViewZoneComponent implements OnInit { 
    @Input() zone: Zone;   
    @Input() site: Site;
    @Input() transects$: Observable<Transect[]>;
    @Input() zonesPref$: Observable<ZonePreference[]>;
    filteredTransects$: Observable<Transect[]>;
    filteredZonesPrefs$: Observable<ZonePreference[]>;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<String>();
    filterFormControl = new FormControl('', []);
    actionsSubscription: Subscription;
    view$: Observable<string>;
    panelDisplay = new FormControl('transects');

    constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions, private windowService: WindowService) { 
        this.actionsSubscription = route.params
          .map(params => this.display(params.view))
          .subscribe();
    }


    ngOnInit() {
        this.filteredTransects$ = this.transects$;
        this.filteredZonesPrefs$ = this.zonesPref$;
    }


    deleteZone() {
        if (this.windowService.confirm("Are you sure you want to delete this zone from database ?")){
            this.remove.emit(this.zone);
        }
    }

    filter(filter: string){
        filter=filter.toLowerCase();
        switch (this.panelDisplay.value) {
            case "transects":
                this.filteredTransects$ = this.transects$.map(transects => 
                    transects.filter(transect => transect.code.toLowerCase().indexOf(filter)!==-1 || 
                        transect.codeSite.toLowerCase().indexOf(filter)!==-1 || 
                        transect.codeZone.toLowerCase().indexOf(filter)!==-1 ||
                        transect.latitude.toLowerCase().indexOf(filter)!==-1 ||
                        transect.longitude.toLowerCase().indexOf(filter)!==-1
                        )
                    );
                break;
            
            default:
                this.filteredZonesPrefs$ = this.zonesPref$.map(zonesPref => 
                    zonesPref.filter(zonePref => zonePref.code.toLowerCase().indexOf(filter)!==-1 || 
                        zonePref.codeSite.toLowerCase().indexOf(filter)!==-1 || 
                        zonePref.codeZone.toString().toLowerCase().indexOf(filter)!==-1 ||
                        zonePref.codeSpecies.toString().toLowerCase().indexOf(filter)!==-1 ||
                        zonePref.presence.toLowerCase().indexOf(filter)!==-1 ||
                        zonePref.infoSource.toString().toLowerCase().indexOf(filter)!==-1
                        )
                    );
                break;
        }
        
    }

    actions(type: string) {
        switch (type) {
            case "zoneForm":
            case "zonePrefForm":
            case "zonePrefImport":
            case "transectForm":
            case "transectImport":
                this.action.emit(type+'/'+this.site._id+"/"+this.zone.code);
                break;
            case "deleteZone":
                this.deleteZone();
                break;
            default:
                break;
        }
        
    }

    display(view: string){
        if(view === "zonesPref"){
            this.view$ = of(view);        
            this.panelDisplay.setValue('zonesPref');
        }
        else {
            this.view$ = of('transects');
            this.panelDisplay.setValue('transects');
        }
    }

    toSites(){
        this.routerext.navigate(['site']);
    }

    toSite(){
        this.routerext.navigate(['site/'+this.site.code]);
    }
}
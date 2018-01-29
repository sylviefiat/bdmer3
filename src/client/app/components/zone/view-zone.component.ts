import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Zone, Transect, ZonePreference } from '../../modules/datas/models/index';
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
    transects$: Observable<Transect[]>;
    zonesPref$: Observable<ZonePreference[]>;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<String>();

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        this.transects$ = of(this.zone.transects);
        this.zonesPref$ = of(this.zone.zonePreferences);
    }


    deleteZone() {
        if (this.windowService.confirm("Are you sure you want to delete this zone from database ?")){
            this.site.zones = this.site.zones.filter(zone => zone.code !== this.zone.code);
            this.remove.emit(this.site);
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

    toSites(){
        this.routerext.navigate(['site']);
    }

    toSite(){
        this.routerext.navigate(['site/'+this.site.code]);
    }
}
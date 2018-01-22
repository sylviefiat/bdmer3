import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site,Zone, ZonePreference } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-pref',
    templateUrl: 'view-preference-area.component.html',
    styleUrls: [
        'view-preference-area.component.css',
    ],
})
export class ViewPreferenceAreaComponent implements OnInit {    
    @Input() site: Site;
    @Input() zone: Zone;
    @Input() zonePref: ZonePreference;
    @Output() remove = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
    }


    deleteZonePref() {
        if (this.windowService.confirm("Are you sure you want to delete this transect from database ?")){
            this.zone.zonePreferences = this.zone.zonePreferences.filter(zonepref => zonepref.code !== this.zonePref.code);
            this.site.zones = [...this.site.zones.filter(zone => zone.code !== this.zone.code),this.zone];
            this.remove.emit(this.site);
        }
    }

}
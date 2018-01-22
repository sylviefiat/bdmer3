import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Zone, Transect } from '../../modules/datas/models/index';
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
    @Output() remove = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        this.transects$ = of(this.zone.transects);
    }


    deleteZone() {
        if (this.windowService.confirm("Are you sure you want to delete this zone from database ?")){
            this.site.zones = this.site.zones.filter(zone => zone.code !== this.zone.code);
            this.remove.emit(this.site);
        }
    }

    addTransect(type: string) {
        type = type.charAt(0).toUpperCase() + type.slice(1);
        this.routerext.navigate(['/'+this.zone.code+'/transect' + type]);
    }


}
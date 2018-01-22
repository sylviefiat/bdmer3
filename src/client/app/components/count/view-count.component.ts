import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site,Zone, Transect, Count } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-count',
    templateUrl: 'view-count.component.html',
    styleUrls: [
        'view-count.component.css',
    ],
})
export class ViewCountComponent implements OnInit {    
    @Input() site: Site;
    @Input() zone: Zone;
    @Input() transect: Transect;
    @Input() count: Count;
    @Output() remove = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        
    }


    deleteTransect() {
        if (this.windowService.confirm("Are you sure you want to delete this transect from database ?")){
            this.transect.counts = this.transect.counts.filter(count => count.code !== this.count.code);
            this.zone.transects = this.zone.transects.filter(transect => transect.code !== this.transect.code);
            this.site.zones = [...this.site.zones.filter(zone => zone.code !== this.zone.code),this.zone];
            this.remove.emit(this.site);
        }
    }

}
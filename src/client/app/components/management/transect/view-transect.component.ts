import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState } from '../../../modules/ngrx/index';

import { SiteAction } from '../../../modules/datas/actions/index';
import { User } from '../../../modules/countries/models/country';
import { Site,Zone, Transect } from '../../../modules/datas/models/index';
import { WindowService } from '../../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-transect',
    templateUrl: 'view-transect.component.html',
    styleUrls: [
        'view-transect.component.css',
    ],
})
export class ViewTransectComponent implements OnInit {    
    @Input() site: Site;
    @Input() zone: Zone;
    @Input() transect: Transect;
    @Output() remove = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();


    constructor(private store: Store<IAppState>, private windowService: WindowService) { }


    ngOnInit() {
        //console.log(this.zone);
    }


    deleteZone() {
        if (this.windowService.confirm("Are you sure you want to delete this transect from database ?"))
            return null;//this.remove.emit({this.site,this.zone});
    }


}
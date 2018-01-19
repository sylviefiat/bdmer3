import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Zone } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-view-site',
    templateUrl: 'view-site.component.html',
    styleUrls: [
        'view-site.component.css',
    ],
})
export class ViewSiteComponent implements OnInit {
    @Input() site: Site;
    @Input() zones$: Observable<Zone[]>;
    @Input() currentUser: User;
    @Output() remove = new EventEmitter<Site>();
    @Output() edit = new EventEmitter<Site>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        this.zones$ = of(this.site.zones);
    }


    isUserAdmin(): boolean {
        console.log(this.currentUser);
        return this.currentUser && this.currentUser.role && this.currentUser.countryCode === 'AA';
    }

    deleteSite() {
        if (this.windowService.confirm("Are you sure you want to delete this site from database ?"))
            return this.remove.emit(this.site);
    }

    addZone(type: string) {
        type = type.charAt(0).toUpperCase() + type.slice(1);
        this.routerext.navigate(['/zone' + type+'/'+this.site._id]);
    }


}
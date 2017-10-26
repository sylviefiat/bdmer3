import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState } from '../../../modules/ngrx/index';

import { SiteAction } from '../../../modules/datas/actions/index';
import { User } from '../../../modules/countries/models/country';
import { Site } from '../../../modules/datas/models/index';
import { WindowService } from '../../../modules/core/services/index';

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
    @Input() currentUser: User;
    @Output() remove = new EventEmitter<Site>();
    @Output() edit = new EventEmitter<Site>();


    constructor(private store: Store<IAppState>, private windowService: WindowService) { }


    ngOnInit() {
        console.log(this.site);
    }


    isUserAdmin(): boolean {
        console.log(this.currentUser);
        return this.currentUser && this.currentUser.role && this.currentUser.countryCode === 'AA';
    }

    deleteSpecies() {
        if (this.windowService.confirm("Are you sure you want to delete this site from database ?"))
            return this.remove.emit(this.site);
    }


}
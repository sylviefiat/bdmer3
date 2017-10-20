import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState, getSpeciesInApp } from '../../../modules/ngrx/index';

import { SpeciesAction } from '../../../modules/datas/actions/index';
import { User } from '../../../modules/countries/models/country';
import { Species } from '../../../modules/datas/models/species';
import { WindowService } from '../../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-view-species',
    templateUrl: 'view-species.component.html',
    styleUrls: [
        'view-species.component.css',
    ],
})
export class ViewSpeciesComponent implements OnInit {
    @Input() species: Species;
    @Input() currentUser: User;
    @Output() remove = new EventEmitter<Species>();
    @Output() edit = new EventEmitter<Species>();


    constructor(private store: Store<IAppState>, private windowService: WindowService) { }


    ngOnInit() {
        console.log(this.species);
    }


    isUserAdmin(): boolean {
        console.log(this.currentUser);
        return this.currentUser && this.currentUser.role && this.currentUser.countryCode === 'AA';
    }

    deleteSpecies() {
        if (this.windowService.confirm("Are you sure you want to delete this species from database ?"))
            return this.remove.emit(this.species);
    }


}
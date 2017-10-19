import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState, getSpeciesInApp } from '../../../modules/ngrx/index';

import { SpeciesAction } from '../../../modules/datas/actions/index';
import { Species } from '../../../modules/datas/models/species';

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
    @Output() remove = new EventEmitter<Species>();
    @Output() edit = new EventEmitter<Species>();


    constructor(private store: Store<IAppState>) { }


    ngOnInit() {
        console.log(this.species);
        
    }


}
import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { SpeciesAction } from '../../modules/datas/actions/index';
import { Country } from '../../modules/countries/models/country';
import { Species } from '../../modules/datas/models/species';
import { WindowService } from '../../modules/core/services/index';

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
    @Input() isAdmin: boolean;
    @Input() countries: Country[];
    @Output() remove = new EventEmitter<Species>();
    @Output() action = new EventEmitter<string>();


    constructor(private store: Store<IAppState>, private windowService: WindowService, public routerext: RouterExtensions) { }


    ngOnInit() {
    }

    toSpecies(){
        this.routerext.navigate(['/species/']);
    }

    get flag() {
        // TO BE CHANGED WITH PHOTOS IN DATABASE
        return "../../../assets/img/"+this.species.code+".jpg";
    }

    getCountryName(code: string) {
        return (this.countries && this.countries.filter(country => country.code === code) && this.countries.filter(country => country.code === code)[0] 
        && this.countries.filter(country => country.code === code)[0].name) || code;
    }

    actions(type: string) {
        switch (type) {
            case "speciesForm":
                this.action.emit(type+'/'+this.species.code);
            break;
            case "deleteSpecies":
                this.deleteSpecies();
            break;
            default:
            break;
        }
        
    }

    deleteSpecies() {
        if (this.windowService.confirm("Are you sure you want to delete this species from database ?"))
            return this.remove.emit(this.species);
    }


}
import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Zone, Transect, Campaign, Count, Species } from '../../modules/datas/models/index';
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
    @Input() campaign: Campaign;
    @Input() count: Count;
    @Input() locale: string;
    @Input() species: Species[];
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<string>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        this.count.mesures=this.count.mesures.sort((left,right) => (left.codeSpecies < right.codeSpecies)?-1:((left.codeSpecies > right.codeSpecies)?1:0));
    }

    getSpeciesName(code: string) {
        return this.species.filter(species => species.code === code)[0]?this.species.filter(species => species.code === code)[0].scientificName:code;
    }

    writeSp(index: number) {
        return (index===0) || this.count.mesures[index].codeSpecies!==this.count.mesures[index-1].codeSpecies;
    }

    getNMesuresSpecies(codeSpecies:string){
        let mesSp = this.count.mesures && this.count.mesures.filter(count => count.codeSpecies === codeSpecies);
        return mesSp && mesSp.length;
    }


    deleteCount() {
        if (this.windowService.confirm("Are you sure you want to delete this count from database ?")) {
            this.remove.emit(this.count);
        }
    }

    actions(type: string) {
        console.log(type);
        switch (type) {
            case "countForm":
            this.action.emit(type + '/' + this.site._id + "/" + this.campaign.code + '/' + this.count.code);
            break;
            case "deleteCount":
            this.deleteCount();
            break;
            default:
            break;
        }

    }


    get monospecies() {
        return this.count.monospecies;
    }  

    get mesures() {
        return this.count.mesures;
    }

    get nMesures(){
      return this.count.mesures && this.count.mesures.length;
    }

    get localDate() {
        switch (this.locale) {
            case "fr":
            return 'dd-MM-yyyy';
            case "en":
            default:
            return 'MM-dd-yyyy';
        }
    }

  get thumbnail(): string | boolean {
    // WAIT FOR MAP
    return null;
    //return "/assets/img/"+this.count.code+".jpg"; 
  }

    toSites() {
        this.routerext.navigate(['site']);
    }

    toSite() {
        this.routerext.navigate(['site/' + this.site.code]);
    }

    toCampaign() {
        this.routerext.navigate(['campaign/' + this.site.code + '/' + this.campaign.code]);
    }

}
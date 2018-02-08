import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Campaign, Count, Species } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-campaign',
    templateUrl: 'view-campaign.component.html',
    styleUrls: [
        'view-campaign.component.css',
    ],
})
export class ViewCampaignComponent implements OnInit {    
    @Input() site: Site;
    @Input() campaign: Campaign;
    @Input() locale: String;
    @Input() species: Species[];
    @Input() counts$: Observable<Count[]>;
    filteredCounts$: Observable<Count[]>;
    filterFormControl = new FormControl('', []);
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<string>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        this.filteredCounts$ = this.counts$;
    }


    deleteCampaign() {
        if (this.windowService.confirm("Are you sure you want to delete this campaign from database ?")){
            this.remove.emit(this.campaign);
        }
    }

    filter(filter: string){
        filter=filter.toLowerCase();
        console.log();
        this.filteredCounts$ = this.counts$.map(counts => 
                    counts.filter(count => count.code.toLowerCase().indexOf(filter)!==-1 || 
                        count.codeSite.toLowerCase().indexOf(filter)!==-1 || 
                        count.codeZone.toLowerCase().indexOf(filter)!==-1 ||
                        count.codeCampaign.toLowerCase().indexOf(filter)!==-1 ||
                        count.codeTransect.toLowerCase().indexOf(filter)!==-1 ||
                        count.date.toString().toLowerCase().indexOf(filter)!==-1 ||
                        count.mesures.filter(mesure => 
                            this.species.filter(sp => sp.code===mesure.codeSpecies && 
                                sp.scientificName.toLowerCase().indexOf(filter)!==-1).length >0).length>0
                        )
                    );                      
    }

    actions(type: string) {
        switch (type) {
            case "campaignForm":
            case "countForm":
            case "countImport":
                this.action.emit(type+'/'+this.site._id+"/"+this.campaign.code);
                break;
            case "deleteCampaign":
                this.deleteCampaign();
                break;
            default:
                break;
        }
        
    }

    toSites(){
        this.routerext.navigate(['site']);
    }

    toSite(){
        this.routerext.navigate(['site/'+this.site.code]);
    }

      get localDate(){
        switch (this.locale) {
          case "fr":
            return 'dd-MM-yyyy';
          case "en":
          default:
            return 'MM-dd-yyyy';
        }
      }

}
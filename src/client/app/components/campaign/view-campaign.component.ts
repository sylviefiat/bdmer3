import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Campaign,Count } from '../../modules/datas/models/index';
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
    counts$: Observable<Count[]>;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<string>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        console.log(this.site);
        console.log(this.campaign);
        this.counts$ = of(this.campaign.counts);
    }


    deleteCampaign() {
        if (this.windowService.confirm("Are you sure you want to delete this campaign from database ?")){
            this.remove.emit(this.campaign);
        }
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
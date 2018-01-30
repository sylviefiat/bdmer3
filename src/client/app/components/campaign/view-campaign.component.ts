import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site,Zone, Campaign } from '../../modules/datas/models/index';
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
    @Input() zone: Zone;
    @Input() campaign: Campaign;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<String>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        console.log(this.campaign);
        console.log(this.site);
        console.log(this.zone);
    }


    deleteCampaign() {
        if (this.windowService.confirm("Are you sure you want to delete this campaign from database ?")){
            this.remove.emit(this.campaign);
        }
    }

    actions(type: string) {
        switch (type) {
            case "campaignForm":
                this.action.emit(type+'/'+this.site._id+"/"+this.zone.code+'/'+this.campaign.code);
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

    toZone(){
        this.routerext.navigate(['zone/'+this.site.code+'/'+this.zone.code]);
    }

}
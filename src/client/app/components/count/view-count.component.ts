import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site,Zone, Transect,Campaign, Count } from '../../modules/datas/models/index';
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
    @Input() zone: Zone;
    @Input() campaign: Campaign;
    @Input() count: Count;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<string>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        
    }


    deleteCount() {
        if (this.windowService.confirm("Are you sure you want to delete this count from database ?")){
            this.remove.emit(this.site);
        }
    }

    actions(type: string) {
        switch (type) {
            case "countForm":
                this.action.emit(type+'/'+this.site._id+"/"+this.zone.code+'/'+this.campaign.code+'/'+this.count.code);
                break;
            case "deleteCount":
                this.deleteCount();
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

    toCampaign(){
        this.routerext.navigate(['campaign/'+this.site.code+'/'+this.zone.code+'/'+this.campaign.code]);
    }

}
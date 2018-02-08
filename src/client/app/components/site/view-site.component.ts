import { Component, OnInit,OnDestroy, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Zone, Campaign } from '../../modules/datas/models/index';
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
export class ViewSiteComponent implements OnInit, OnDestroy {
    @Input() site: Site;
    @Input() msg: string | null;
    @Input() zones$: Observable<Zone[]>;
    @Input() campaigns$: Observable<Campaign[]>;
    filteredZones$: Observable<Zone[]>;
    filteredCampaigns$: Observable<Campaign[]>;
    filterFormControl = new FormControl('', []);
    @Output() remove = new EventEmitter<Site>();
    @Output() action = new EventEmitter<String>();
    actionsSubscription: Subscription;
    view$: Observable<string>;
    panelDisplay = new FormControl('campaigns');


    constructor(private store: Store<IAppState>, route: ActivatedRoute,public routerext: RouterExtensions, private windowService: WindowService) { 
        this.actionsSubscription = route.params
        .map(params => this.display(params.view))
        .subscribe();
    }

    ngOnInit() {   
        this.filteredZones$ = this.zones$;
        this.filteredCampaigns$ = this.campaigns$;
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    deleteSite() {
        if (this.windowService.confirm("Are you sure you want to delete this site from database ?"))
            return this.remove.emit(this.site);
    }

    filter(filter: string){
        filter=filter.toLowerCase();
        switch (this.panelDisplay.value) {
            case "zones":
                this.filteredZones$ = this.zones$.map(zones => 
                    zones.filter(zone => zone.code.toLowerCase().indexOf(filter)!==-1 || 
                        zone.codeSite.toLowerCase().indexOf(filter)!==-1 || 
                        zone.surface.toLowerCase().indexOf(filter)!==-1
                        )
                    );
                break;
            
            default:
                this.filteredCampaigns$ = this.campaigns$.map(campaigns => 
                    campaigns.filter(campaign => campaign.code.toLowerCase().indexOf(filter)!==-1 || 
                        campaign.codeSite.toLowerCase().indexOf(filter)!==-1 || 
                        campaign.dateStart.toString().toLowerCase().indexOf(filter)!==-1 ||
                        campaign.dateEnd.toString().toLowerCase().indexOf(filter)!==-1 ||
                        campaign.participants.toLowerCase().indexOf(filter)!==-1 ||
                        campaign.surfaceTransect.toString().toLowerCase().indexOf(filter)!==-1 ||
                        campaign.description.toLowerCase().indexOf(filter)!==-1
                        )
                    );
                break;
        }
        
    }

    actions(type: string) {
        switch (type) {
            case "siteForm":
            case "zoneForm":
            case "zoneImport":
            case "campaignForm":
            case "campaignImport":
            case "zonePrefImport":
            case "transectImport":
            case "countImport":
            this.action.emit(type+'/'+this.site._id);
            break;
            case "deleteSite":
            this.deleteSite();
            break;
            default:
            break;
        }
        
    }

    display(view: string){
        if(view === "zones"){
            this.view$ = of(view);        
            this.panelDisplay.setValue('zones');
        }
        else {
            this.view$ = of('campaigns');
            this.panelDisplay.setValue('campaigns');
        }
    }

    toSites() {
        this.routerext.navigate(['site']);
    }
}
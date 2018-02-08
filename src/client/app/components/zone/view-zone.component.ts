import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site, Zone, Transect, ZonePreference, Campaign } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone',
    templateUrl: 'view-zone.component.html',
    styleUrls: [
        'view-zone.component.css',
    ],
})
export class ViewZoneComponent implements OnInit { 
    @Input() zone: Zone;   
    @Input() site: Site;
    @Input() transects$: Observable<Transect[]>;
    @Input() zonesPref$: Observable<ZonePreference[]>;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<String>();
    actionsSubscription: Subscription;
    view$: Observable<string>;
    panelDisplay = new FormControl('transects');

    constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions, private windowService: WindowService) { 
        this.actionsSubscription = route.params
          .map(params => this.display(params.view))
          .subscribe();
    }


    ngOnInit() {
        //this.view$ = of('transects');
    }


    deleteZone() {
        if (this.windowService.confirm("Are you sure you want to delete this zone from database ?")){
            this.remove.emit(this.zone);
        }
    }

    actions(type: string) {
        switch (type) {
            case "zoneForm":
            case "zonePrefForm":
            case "zonePrefImport":
            case "transectForm":
            case "transectImport":
                this.action.emit(type+'/'+this.site._id+"/"+this.zone.code);
                break;
            case "deleteZone":
                this.deleteZone();
                break;
            default:
                break;
        }
        
    }

    display(view: string){
        if(view === "zonesPref"){
            this.view$ = of(view);        
            this.panelDisplay.setValue('zonesPref');
        }
        else {
            this.view$ = of('transects');
            this.panelDisplay.setValue('transects');
        }
    }

    toSites(){
        this.routerext.navigate(['site']);
    }

    toSite(){
        this.routerext.navigate(['site/'+this.site.code]);
    }
}
import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog, MatDialogConfig} from "@angular/material";

import { IAppState } from '../../modules/ngrx/index';

import { PlatformAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Platform, Zone, Property, Transect, ZonePreference, Survey } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';
import { zoneMapModal } from './zone-map-modal.component';

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
    @Input() platform: Platform;
    @Input() transects$: Observable<Transect[]>;
    @Input() zonesPref$: Observable<ZonePreference[]>;
    filteredTransects$: Observable<Transect[]>;
    filteredZonesPrefs$: Observable<ZonePreference[]>;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<String>();
    filterFormControl = new FormControl('', []);
    actionsSubscription: Subscription;
    view$: Observable<string>;
    panelDisplay = new FormControl('transects');

    fileNameDialogRef: MatDialogRef<zoneMapModal>;

    constructor(private dialog: MatDialog, private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions, private windowService: WindowService) { 
        this.actionsSubscription = route.params
          .map(params => this.display(params.view))
          .subscribe();
    }


    ngOnInit() {
        this.filteredTransects$ = this.transects$;
        this.filteredZonesPrefs$ = this.zonesPref$;
    }


    deleteZone() {
        if (this.windowService.confirm("Are you sure you want to delete this zone from database ?")){
            this.remove.emit(this.zone);
        }
    }

    filter(filter: string){
        filter=filter.toLowerCase();
        switch (this.panelDisplay.value) {
            case "transects":
                this.filteredTransects$ = this.transects$.map(transects => 
                    transects.filter(transect => transect.properties.code.toLowerCase().indexOf(filter)!==-1 || 
                        transect.codePlatform.toLowerCase().indexOf(filter)!==-1 || 
                        transect.codeZone.toLowerCase().indexOf(filter)!==-1 ||
                        transect.geometry["coordinates"].toString().toLowerCase().indexOf(filter)!==-1
                        )
                    );
                break;
            
            default:
                this.filteredZonesPrefs$ = this.zonesPref$.map(zonesPref => 
                    zonesPref.filter(zonePref => zonePref.code.toLowerCase().indexOf(filter)!==-1 || 
                        zonePref.codePlatform.toLowerCase().indexOf(filter)!==-1 || 
                        zonePref.codeZone.toString().toLowerCase().indexOf(filter)!==-1 ||
                        zonePref.codeSpecies.toString().toLowerCase().indexOf(filter)!==-1 ||
                        zonePref.presence.toLowerCase().indexOf(filter)!==-1 ||
                        zonePref.infoSource.toString().toLowerCase().indexOf(filter)!==-1
                        )
                    );
                break;
        }
        
    }

    actions(type: string) {
        switch (type) {
            case "zoneForm":
            case "zonePrefForm":
            case "zonePrefImport":
            case "transectForm":
            case "transectImport":
                this.action.emit(type+'/'+this.platform._id+"/"+this.zone.properties.code);
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

    toPlatforms(){
        this.routerext.navigate(['platform']);
    }

    toPlatform(){
        this.routerext.navigate(['platform/'+this.platform.code]);
    }

    openDialog() {
        this.fileNameDialogRef = this.dialog.open(zoneMapModal, {
            data: this.zone.staticmap
        });
    }
}
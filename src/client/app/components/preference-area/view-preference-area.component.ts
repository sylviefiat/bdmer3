import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { PlatformAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Platform,Zone, ZonePreference } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-pref',
    templateUrl: 'view-preference-area.component.html',
    styleUrls: [
        'view-preference-area.component.css',
    ],
})
export class ViewPreferenceAreaComponent implements OnInit {    
    @Input() platform: Platform;
    @Input() zone: Zone;
    @Input() zonePref: ZonePreference;
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<any>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
    }


    deleteZonePref() {
        if (this.windowService.confirm("Are you sure you want to delete this zone preference from database ?")){
            this.remove.emit(this.zonePref);
        }
    }

    actions(type: string) {
        console.log(type);
        switch (type) {
            case "zonePrefForm":
                this.action.emit(type + '/' + this.platform._id + "/" + this.zone.properties.code + '/' + this.zonePref.code);
                break;
            case "deleteZonePref":
                this.deleteZonePref();
                break;
            default:
                break;
        }

    }

    toPlatforms(){
        this.routerext.navigate(['platform']);
    }

    toPlatform(){
        this.routerext.navigate(['platform/'+this.platform.code]);
    }

    toZone(){
        this.routerext.navigate(['zone/'+this.platform.code+'/'+this.zone.properties.code]);
    }

  get thumbnailZone(): string | boolean {
      //WAIT FOR MAP
      return null;
    //return "/assets/img/"+this.zonePref.codeSpecies+".jpg"; 
  }

  get thumbnailSpecies(): string | boolean {
    return this.zonePref.picture; 
  }
}
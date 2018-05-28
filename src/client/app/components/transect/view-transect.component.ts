import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { MatDialogRef, MatDialog, MatDialogConfig} from "@angular/material";

import { IAppState } from '../../modules/ngrx/index';

import { PlatformAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Platform,Zone, Transect, Count } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';
import { transectMapModal } from './transect-map-modal.component';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-transect',
    templateUrl: 'view-transect.component.html',
    styleUrls: [
        'view-transect.component.css',
    ],
})
export class ViewTransectComponent implements OnInit {    
    @Input() platform: Platform;
    @Input() zone: Zone;
    @Input() transect: Transect;
    
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<String>();

    fileNameDialogRef: MatDialogRef<transectMapModal>;

    constructor(private dialog: MatDialog, private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        
    }


    deleteTransect() {
        if (this.windowService.confirm("Are you sure you want to delete this transect from database ?")){
            this.remove.emit(this.transect);
        }
    }

    actions(type: string) {
        switch (type) {
            case "transectForm":
                this.action.emit(type+'/'+this.platform._id+"/"+this.zone.properties.code+'/'+this.transect.properties.code);
                break;
            case "deleteTransect":
                this.deleteTransect();
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

    openDialog() {
        this.fileNameDialogRef = this.dialog.open(transectMapModal, {
            data: this.transect.staticMapTransect    
        });
    }

}
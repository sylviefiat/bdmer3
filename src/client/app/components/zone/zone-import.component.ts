import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as togeojson from '@mapbox/togeojson';
import * as area from '@mapbox/geojson-area';
import {TranslateService} from '@ngx-translate/core';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone } from '../../modules/datas/models/index';
import { NameRefactorService } from '../../modules/core/services/nameRefactor.service';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-import',
    templateUrl: './zone-import.component.html',
    styleUrls: [
        './zone-import.component.css',
    ],
})
export class ZoneImportComponent implements OnDestroy{
    @Input() platform: Platform;
    @Input() zone: Zone | null;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();
    actionSubscription : Subscription;

    needHelp: boolean = false;
    private kmlFile: string;
    private docs_repo: string;

    constructor(private nameRefactorService: NameRefactorService, private store: Store<IAppState>, 
        public routerext: RouterExtensions, route: ActivatedRoute, private translate: TranslateService) {
        this.actionSubscription = this.store.select(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.kmlFile = "importZones-"+l+".kml";
        });
    }

    ngOnDestroy() {
      this.actionSubscription.unsubscribe();
    }

    kmlToGeoJson(kml){
            const reader = new FileReader();
            reader.readAsText(kml);

            const self = this;

            reader.onload = function(event) {
              const parser = new DOMParser();              
              const x = parser.parseFromString((<string>reader.result), 'application/xml')
              const geojson = togeojson.kml(x).features;

              for(let i  in geojson){
                if(geojson[i].properties.name){
                    delete geojson[i].properties['styleHash'];
                    delete geojson[i].properties['styleMapHash'];
                    delete geojson[i].properties['styleUrl'];
                    geojson[i].properties.code = self.platform.code+"_"+self.nameRefactorService.convertAccent(geojson[i].properties.name).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,'');
                    const surface = area.geometry(geojson[i].geometry);

                    geojson[i].properties.surface = parseInt(surface.toString().split('.')['0']);
                    console.log(geojson[i]);
                    self.upload.emit(geojson[i]);
                } else {
                    self.err.emit(self.translate.instant('ERROR_GEOJSON_ZONE_NAME'));
                }
              }
            }
    }

    handleUpload(kmlFile: any): void {
      if (kmlFile.target.files && kmlFile.target.files.length > 0) {
        this.kmlToGeoJson(kmlFile.target.files['0']);
      }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getKmlZones() {
        return this.kmlFile;
    }

    getKmlZonesUrl() {
        return this.docs_repo + this.kmlFile;
    }

    cancel() {
        this.back.emit(this.platform.code);
    }
}
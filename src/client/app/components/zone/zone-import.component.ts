import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MapStaticService} from '../../modules/core/services/map-static.service';
import * as togeojson from '@mapbox/togeojson';
import * as area from '@mapbox/geojson-area';

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
export class ZoneImportComponent implements OnInit{
    @Input() platform: Platform;
    @Input() zone: Zone | null;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();

    needHelp: boolean = false;
    private kmlFile: string;
    private docs_repo: string;

    constructor(private mapStaticService: MapStaticService, private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {

    }

    ngOnInit() {
      this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.kmlFile = "importZones-"+l+".kml";
        });
    }

    kmlToGeoJson(kml){
            const reader = new FileReader();
            reader.readAsText(kml);

            const self = this;

            reader.onload = function(event) {
              const parser = new DOMParser();
              const x = parser.parseFromString(reader.result, 'application/xml')
              const geojson = togeojson.kml(x).features;

              for(let i  in geojson){
                delete geojson[i].properties['styleHash'];
                delete geojson[i].properties['styleMapHash'];
                delete geojson[i].properties['styleUrl'];

                geojson[i].properties.code = self.platform.code+"_"+self.nameRefactorService.convertAccent(geojson[i].properties.name).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,'');
                
                const surface = area.geometry(geojson[i].geometry);

                geojson[i].properties.surface = parseInt(surface.toString().split('.')['0']);

                self.upload.emit(geojson[i]);
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
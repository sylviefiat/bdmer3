import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as togeojson from '@mapbox/togeojson';
import * as area from '@mapbox/geojson-area';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getisAdmin, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { NameRefactorService } from '../../modules/core/services/nameRefactor.service';
import { MapStaticService} from '../../modules/core/services/map-static.service';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-global-import-page',
    templateUrl: './global-import-page.component.html',
    styleUrls: [
    './global-import-page.component.css',
    ],
})
export class GlobalImportPageComponent implements OnInit {
    platform: object;
    error$: Observable<string | null>;
    isAdmin$: Observable<Country>;
    locale$: Observable<boolean>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private docs_repo: string;
    language: string;
    csvFileSurvey: object;
    csvFileZonePre: object;
    csvFileTransect: object;
    csvFileCount: object;
    kmlFileZones: object;

    constructor(private mapStaticService: MapStaticService, private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        this.store.let(getSelectedPlatform).subscribe((platform) =>{
          this.platform = platform;
        });

        this.error$ = this.store.let(getPlatformPageError);
        this.isAdmin$ = this.store.let(getisAdmin);
        this.store.let(getLangues).subscribe((l: any) => {
            this.language = l;
            this.docs_repo = "../../../assets/files/";
        });
    }

    handleUploadKml(kmlFile: any): void {
      if (kmlFile.target.files && kmlFile.target.files.length > 0) {
          this.kmlFileZones = kmlFile.target.files['0'];
      }
    }

    handleUploadCsv(csvFile: any, type: string): void {
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            switch (type) {
                case "Survey":
                this.csvFileSurvey = csvFile.target.files["0"];
                break;
                case "ZonePref":
                this.csvFileZonePre = csvFile.target.files["0"];
                break;
                case "Transect":
                this.csvFileTransect = csvFile.target.files["0"];
                break;
                case "Count":
                this.csvFileCount = csvFile.target.files["0"];
                break;
            }
        } else {
            this.store.dispatch(new PlatformAction.AddPlatformFailAction('No csv file found'));
        }
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

                geojson[i].properties.code = self.platform["code"]+"_"+self.nameRefactorService.convertAccent(geojson[i].properties.name).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,'');
                
                const surface = area.geometry(geojson[i].geometry);

                geojson[i].properties.surface = parseInt(surface.toString().split('.')['0']);

                self.store.dispatch(new PlatformAction.ImportZoneAction(geojson[i]))
              }
            }
    }

    deleteCsv(type: string){
        switch (type) {
            case "Survey":
            this.csvFileSurvey = null;
            break;
            case "ZonePref":
            this.csvFileZonePre = null;
            break;
            case "Transect":
            this.csvFileTransect = null;
            break;
            case "Count":
            this.csvFileCount = null;
            break;
        }
    }

    deleteKml(){
        this.kmlFileZones = null;
    }

    send(){
        if(this.csvFileSurvey)
            this.store.dispatch(new PlatformAction.ImportSurveyAction(this.csvFileSurvey));

        if(this.csvFileZonePre)
            this.store.dispatch(new PlatformAction.ImportZonePrefAction(this.csvFileZonePre));

        if(this.csvFileTransect)
            this.store.dispatch(new PlatformAction.ImportTransectAction(this.csvFileTransect));

        if(this.csvFileCount)
            this.store.dispatch(new PlatformAction.ImportCountAction(this.csvFileCount));

        if(this.kmlFileZones)
            this.kmlToGeoJson(this.kmlFileZones)

        this.return();
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvUrl(type){
        return this.docs_repo + "import" + type + "-" + this.language +".csv"
    }

    getKmlUrl(type){
        return this.docs_repo + "import" + type + "-" + this.language +".kml"
    }

    return() {
        this.routerext.navigate(['/platform/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}
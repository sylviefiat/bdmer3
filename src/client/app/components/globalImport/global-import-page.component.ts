import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
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
    next: boolean = false;

    constructor(private mapStaticService: MapStaticService, private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {
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
          this.store.dispatch(new PlatformAction.AddPendingZoneAction({file: this.kmlFileZones, type: 'zone'}));
          this.next = true;
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
                this.store.dispatch(new PlatformAction.CheckZonePrefCsvFile(this.csvFileZonePre));
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

    ngOnDestroy() {
        this.store.dispatch(new PlatformAction.ResetAllPendingAction());
    }
}
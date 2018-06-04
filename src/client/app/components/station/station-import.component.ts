import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-station-import',
    templateUrl: './station-import.component.html',
    styleUrls: [
        './station-import.component.css',
    ],
})
export class StationImportComponent implements OnInit{
    @Input() platform: Platform;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Input() importError: string[];
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();

    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;
    private importCsvFile = null;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        console.log(this.importError)
        console.log(this.error)
        console.log(this.importCsvFile)
        this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importStation-"+l+".csv";
        });
    }

    handleUpload(csvFile: any): void {
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.importCsvFile = csvFile.target.files[0];
            this.check(this.importCsvFile);
        } else {
            this.err.emit('No csv file found');
        }
    }

    check(csvFile){
        this.store.dispatch(new PlatformAction.CheckStationCsvFile(csvFile));
    }

    send(){
        this.upload.emit(this.importCsvFile);
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvStations() {
        return this.csvFile;
    }

    getCsvStationsUrl() {
        return this.docs_repo + this.csvFile;
    }

    cancel() {
        this.back.emit();
    }
}
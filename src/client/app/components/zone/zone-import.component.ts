import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSitePageMsg, getLangues } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
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
    @Input() site: Site;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();

    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importZone-"+l+".csv";
        });
    }

    handleUpload(csvFile: any): void {
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.upload.emit(csvFile.target.files[0]);
        } else {
            this.err.emit('No csv file found');
        }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvZones() {
        return this.csvFile;
    }

    getCsvZonesUrl() {
        return this.docs_repo + this.csvFile;
    }

    cancel() {
        this.back.emit(this.site.code);
    }
}
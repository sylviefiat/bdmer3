import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Species } from '../../modules/datas/models/species';

import { IAppState, getSpeciesPageError, getSelectedSpecies, getSpeciesPageMsg, getLangues } from '../../modules/ngrx/index';
import { SpeciesAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-species-import-page',
    templateUrl: './species-import-page.component.html',
    styleUrls: [
        './species-import-page.component.css',
    ],
})
export class SpeciesImportPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    msg$: Observable<string | null>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private translate: TranslateService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
      this.actionsSubscription = this.store.select(getLangues).subscribe((l: any) => {
        this.docs_repo = "../../../assets/files/";
            this.csvFile = "importSpecies-"+l+".csv";
      });
    }

    ngOnInit() {
        this.error$ = this.store.select(getSpeciesPageError);
        this.msg$ = this.store.select(getSpeciesPageMsg);        
    }

    ngOnDestroy() {

    }

    handleUpload(csvFile: any): void {
        let notFoundMsg = this.translate.instant('NO_CSV_FOUND');
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.store.dispatch(new SpeciesAction.ImportSpeciesAction(csvFile.target.files[0]));
        } else {
            this.store.dispatch(new SpeciesAction.AddSpeciesFailAction(notFoundMsg));
        }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvSpecies() {
        return this.csvFile;
    }

    getCsvSpeciesUrl() {
        return this.docs_repo + this.csvFile;
    }

    return() {
        this.routerext.navigate(['/species/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}
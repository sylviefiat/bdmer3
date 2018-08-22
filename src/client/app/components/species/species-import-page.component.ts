import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormControl } from "@angular/forms";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Species } from "../../modules/datas/models/species";
import { Csv2JsonService } from "../../modules/core/services/csv2json.service";

import { IAppState, getSpeciesPageError, getSelectedSpecies, getSpeciesPageMsg, getLangues } from "../../modules/ngrx/index";
import { SpeciesAction } from "../../modules/datas/actions/index";
import { CountriesAction } from "../../modules/countries/actions/index";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-species-import-page",
  templateUrl: "./species-import-page.component.html",
  styleUrls: ["./species-import-page.component.css"]
})
export class SpeciesImportPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  msg$: Observable<string | null>;
  actionsSubscription: Subscription;
  needHelp: boolean = false;
  private csvFile: string;
  private docs_repo: string;
  importCsvFile: any = null;
  constructor(
    private csv2JsonService: Csv2JsonService,
    private translate: TranslateService,
    private store: Store<IAppState>,
    public routerext: RouterExtensions,
    route: ActivatedRoute
  ) {
    this.actionsSubscription = this.store.select(getLangues).subscribe((l: any) => {
      this.docs_repo = "../../../assets/files/";
      this.csvFile = "importSpecies-" + l + ".csv";
    });
  }

  speciesForm: FormGroup = new FormGroup({
    speciesInputFile: new FormControl()
  });

  ngOnInit() {
    this.error$ = this.store.select(getSpeciesPageError);
    this.msg$ = this.store.select(getSpeciesPageMsg);
  }

  ngOnDestroy() {}

  handleUpload(csvFile: any): void {
    let notFoundMsg = this.translate.instant("NO_CSV_FOUND");
    let reader = new FileReader();
    if (csvFile.target.files && csvFile.target.files.length > 0) {
      this.importCsvFile = csvFile.target.files[0];
      this.check();
    } else {
      this.store.dispatch(new SpeciesAction.AddSpeciesFailAction(notFoundMsg));
    }
  }

  check() {
    this.store.dispatch(new SpeciesAction.CheckSpeciesCsvFile(this.importCsvFile));
  }

  changeNeedHelp() {
    this.needHelp = !this.needHelp;
  }

  getCsvSpecies() {
    return this.importCsvFile;
  }

  clearInput() {
    this.speciesForm.get("speciesInputFile").reset();
  }

  getCsvSpeciesUrl() {
    return this.docs_repo + this.csvFile;
  }
  send() {
    this.store.dispatch(new SpeciesAction.ImportSpeciesAction(this.importCsvFile));
  }
  return() {
    this.routerext.navigate(["/species/"], {
      transition: {
        duration: 1000,
        name: "slideTop"
      }
    });
  }
}

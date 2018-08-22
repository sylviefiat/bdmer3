import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { Csv2JsonService } from "../../modules/core/services/csv2json.service";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Platform, Zone, Survey, Count } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getPlatformImpErrors, getLangues } from "../../modules/ngrx/index";
import { PlatformAction, SpeciesAction } from "../../modules/datas/actions/index";
import { CountriesAction } from "../../modules/countries/actions/index";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-count-import",
  templateUrl: "./count-import.component.html",
  styleUrls: ["./count-import.component.css"]
})
export class CountImportComponent implements OnInit {
  @Input() platform: Platform;
  @Input() survey: Survey;
  @Input() error: string | null;
  @Input() msg: string | null;
  @Input() countries: Country[];
  @Input() importError: string[];
  @Output() upload = new EventEmitter<any>();
  @Output() err = new EventEmitter<string>();
  @Output() back = new EventEmitter();

  newCounts$: Observable<Count>;
  needHelp: boolean = false;
  private csvFile: string;
  private docs_repo: string;
  importCsvFile: any = null;
  countForm: FormGroup = new FormGroup({
    countInputFile: new FormControl()
  });

  constructor(
    private csv2JsonService: Csv2JsonService,
    private translate: TranslateService,
    private store: Store<IAppState>,
    public routerext: RouterExtensions,
    route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new SpeciesAction.LoadAction());
    this.store.select(getLangues).subscribe((l: any) => {
      this.docs_repo = "../../../assets/files/";
      this.csvFile = "importCount-" + l + ".csv";
    });
  }

  handleUpload(csvFile: any): void {
    let csvErrorMsg = this.translate.instant("NO_CSV_FOUND");

    let reader = new FileReader();

    if (csvFile.target.files && csvFile.target.files.length > 0) {
      this.importCsvFile = csvFile.target.files[0];
      this.check(this.importCsvFile);
    } else {
      this.err.emit(csvErrorMsg);
    }
  }

  check(csvFile) {
    this.store.dispatch(new PlatformAction.CheckCountCsvFile(csvFile));
    this.newCounts$ = this.csv2JsonService.extractCountPreviewData(csvFile);
  }

  send() {
    this.upload.emit(this.importCsvFile);
  }

  changeNeedHelp() {
    this.needHelp = !this.needHelp;
  }

  clearInput() {
    this.countForm.get("countInputFile").reset();
  }

  getCsvCounts() {
    return this.csvFile;
  }

  getCsvCountsUrl() {
    return this.docs_repo + this.csvFile;
  }

  cancel() {
    this.back.emit();
  }
}

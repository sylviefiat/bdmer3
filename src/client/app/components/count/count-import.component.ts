import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, from } from "rxjs";
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
  @Input() countriesCount: string[];
  @Input() importError: string[];
  @Output() upload = new EventEmitter<any>();
  @Output() err = new EventEmitter<string>();
  @Output() back = new EventEmitter();

  newCounts$: Observable<{}>;
  needHelp: boolean = false;
  type: string = "count";
  private csvFileType1: string;
  private csvFileType2: string;
  private docs_repo: string;
  importCsvFile: any = null;
  countForm: FormGroup = new FormGroup({
    countInputFile: new FormControl()
  });
  country: Country;


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
      //this.docs_repo = "../../../assets/files/";
      this.docs_repo = "assets/files/";
      this.csvFileType1 = "importCountNoMesures-" + l + ".csv";
      this.csvFileType2 = "importCount-" + l + ".csv";
    });
    this.country = this.countries.filter(c => c.code === this.platform.codeCountry)[0];
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
    this.store.dispatch(new PlatformAction.CheckCountCsvFile({csvFile: csvFile, type: this.type}));
    this.newCounts$ = from(this.csv2JsonService.csv2('count',csvFile));

  }

  send() {
    this.upload.emit({csvFile: this.importCsvFile, type: this.type});
  }

  changeNeedHelp() {
    this.needHelp = !this.needHelp;
  }

  clearInput() {
    this.countForm.get("countInputFile").reset();
  }

  get csvCountsUrlType1() {
    return this.docs_repo + this.csvFileType1;
  }

  get csvCountsUrlType2() {
    return this.docs_repo + this.csvFileType2;
  }

  cancel() {
    this.back.emit();
  }
}

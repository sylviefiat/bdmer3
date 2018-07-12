import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Platform, Zone } from "../../modules/datas/models/index";

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getPlatformImpErrors, getLangues } from "../../modules/ngrx/index";
import { PlatformAction, SpeciesAction } from "../../modules/datas/actions/index";
import { CountriesAction } from "../../modules/countries/actions/index";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-zone-pref-import",
  templateUrl: "./preference-area-import.component.html",
  styleUrls: ["./preference-area-import.component.css"]
})
export class PreferenceAreaImportComponent implements OnDestroy {
  @Input() platform: Platform;
  @Input() zone: Zone;
  @Input() error: string | null;
  @Input() importError: string[] | null;
  @Input() msg: string | null;
  @Output() upload = new EventEmitter<any>();
  @Output() err = new EventEmitter<string>();
  @Output() back = new EventEmitter();
  actionSubscription: Subscription;

  needHelp: boolean = false;
  private csvFile: string;
  private docs_repo: string;
  importCsvFile: any = null;

  zonePrefForm: FormGroup = new FormGroup({
    zonePrefInputFile: new FormControl()
  });

  constructor(private translate: TranslateService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    this.actionSubscription = this.store.select(getLangues).subscribe((l: any) => {
      this.docs_repo = "../../../assets/files/";
      this.csvFile = "importZonePref-" + l + ".csv";
    });
  }

  ngOnInit() {
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  ngOnDestroy() {
    this.actionSubscription.unsubscribe();
  }

  handleUpload(csvFile: any): void {
    let notFoundMsg = this.translate.instant("NO_CSV_FOUND");
    let reader = new FileReader();

    if (csvFile.target.files && csvFile.target.files.length > 0) {
      this.importCsvFile = csvFile.target.files[0];
      this.check(this.importCsvFile);
    } else {
      this.err.emit(notFoundMsg);
    }
  }

  check(csvFile) {
    this.store.dispatch(new PlatformAction.CheckZonePrefCsvFile(csvFile));
  }

  send() {
    this.upload.emit(this.importCsvFile);
  }

  changeNeedHelp() {
    this.needHelp = !this.needHelp;
  }

  clearInput() {
    this.zonePrefForm.get("zonePrefInputFile").reset();
  }

  getCsvZonesPref() {
    return this.csvFile;
  }

  getCsvZonesPrefUrl() {
    return this.docs_repo + this.csvFile;
  }

  cancel() {
    this.back.emit(this.platform.code);
  }
}

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, of, Subscription, from } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { GeojsonService } from "../../modules/core/services/geojson.service";
import { TranslateService } from "@ngx-translate/core";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Platform, Zone } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getLangues } from "../../modules/ngrx/index";
import { PlatformAction } from "../../modules/datas/actions/index";
import { CountriesAction } from "../../modules/countries/actions/index";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-zone-import",
  templateUrl: "./zone-import.component.html",
  styleUrls: ["./zone-import.component.css"]
})
export class ZoneImportComponent implements OnDestroy {
  @Input() platform: Platform;
  @Input() zone: Zone | null;
  @Input() error: string | null;
  @Input() msg: string | null;
  @Input() countries: Country[];
  @Output() upload = new EventEmitter<any>();
  @Output() removeAllZone = new EventEmitter<any>();
  @Output() err = new EventEmitter<string>();
  @Output() back = new EventEmitter();
  actionSubscription: Subscription;
  geojsons$: Observable<any>;
  intersectError$: Observable<string>;
  importKmlFile: any = null;
  zoneForm: FormGroup = new FormGroup({
    zoneInput: new FormControl()
  });

  needHelp: boolean = false;
  private kmlFile: string;
  private docs_repo: string;

  constructor(
    private geojsonService: GeojsonService,
    private store: Store<IAppState>,
    public routerext: RouterExtensions,
    route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.actionSubscription = this.store.select(getLangues).subscribe((l: any) => {
      this.docs_repo = "../../../assets/files/";
      this.kmlFile = "importZones-" + l + ".kml";
    });
  }

  ngOnDestroy() {
    this.actionSubscription.unsubscribe();
  }

  handleUpload(kmlFile: any) {
    if (kmlFile.target.files && kmlFile.target.files.length > 0) {
      this.importKmlFile = kmlFile;
      this.intersectError$ = of("checking");
      this.geojsons$ = from(this.geojsonService.kmlToGeoJson(kmlFile.target.files["0"], this.platform));
    }
  }

  clearInput() {
    this.zoneForm.get("zoneInput").reset();
  }

  zoneIntersect(error) {
    console.log(error);
    this.intersectError$ = of(error);
  }

  changeNeedHelp() {
    this.needHelp = !this.needHelp;
  }

  send() {
    let msg = this.translate.instant("WILL_DELETE_ALL_ZONE");
    if (this.platform.zones.length > 0) {
      if (confirm(msg)) {
        this.removeAllZone.emit(this.platform);
        this.upload.emit(this.importKmlFile.target.files["0"]);
      }
    } else {
      this.upload.emit(this.importKmlFile.target.files["0"]);
    }
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

import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, of, Subscription, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { RouterExtensions, Config } from "../../modules/core/index";
import { ActivatedRoute } from "@angular/router";
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { IAppState } from "../../modules/ngrx/index";

import { PlatformAction } from "../../modules/datas/actions/index";
import { User } from "../../modules/countries/models/country";
import { Platform, Zone, Property, Station, ZonePreference, Survey } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";
import { WindowService } from "../../modules/core/services/index";
import { zoneMapModal } from "./zone-map-modal.component";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-view-zone",
  templateUrl: "view-zone.component.html",
  styleUrls: ["view-zone.component.css"]
})
export class ViewZoneComponent implements OnInit {
  @Input() zone: Zone;
  @Input() platform: Platform;
  @Input() countries: Country[];
  @Input() stations$: Observable<Station[]>;
  @Input() zonesPref$: Observable<ZonePreference[]>;
  filteredStations$: Observable<Station[]>;
  filteredZonesPrefs$: Observable<ZonePreference[]>;
  @Output() remove = new EventEmitter<any>();
  @Output() action = new EventEmitter<String>();
  filterFormControl = new FormControl("", []);
  actionsSubscription: Subscription;
  view$: Observable<string>;
  panelDisplay = new FormControl("stations");

  fileNameDialogRef: MatDialogRef<zoneMapModal>;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private store: Store<IAppState>,
    route: ActivatedRoute,
    public routerext: RouterExtensions,
    private windowService: WindowService
  ) {
    this.actionsSubscription = route.params.pipe(map(params => this.display(params.view))).subscribe();
  }

  ngOnInit() {
    this.filteredStations$ = this.stations$;
    this.filteredZonesPrefs$ = this.zonesPref$;
  }

  deleteZone() {
    let deleteMsg = this.translate.instant("CONFIRM_DELETE_ZONE");

    if (this.windowService.confirm(deleteMsg)) {
      this.remove.emit(this.zone);
    }
  }

  filter(filter: string) {
    filter = filter.toLowerCase();
    switch (this.panelDisplay.value) {
      case "stations":
        this.filteredStations$ = this.stations$.pipe(
          map(stations =>
            stations.filter(
              station =>
                station.properties.code.toLowerCase().indexOf(filter) !== -1 ||
                station.codePlatform.toLowerCase().indexOf(filter) !== -1 ||
                station.geometry["coordinates"]
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1
            )
          )
        );
        break;

      default:
        this.filteredZonesPrefs$ = this.zonesPref$.pipe(
          map(zonesPref =>
            zonesPref.filter(
              zonePref =>
                zonePref.code.toLowerCase().indexOf(filter) !== -1 ||
                zonePref.codePlatform.toLowerCase().indexOf(filter) !== -1 ||
                zonePref.codeZone
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1 ||
                zonePref.codeSpecies
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1 ||
                zonePref.presence.toLowerCase().indexOf(filter) !== -1 ||
                zonePref.infoSource
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1
            )
          )
        );
        break;
    }
  }

  actions(type: string) {
    switch (type) {
      case "zoneForm":
      case "zonePrefForm":
      case "zonePrefImport":
      case "stationForm":
      case "stationImport":
        this.action.emit(type + "/" + this.platform._id + "/" + this.zone.properties.code);
        break;
      case "deleteZone":
        this.deleteZone();
        break;
      default:
        break;
    }
  }

  display(view: string) {
    if (view === "zonesPref") {
      this.view$ = of(view);
      this.panelDisplay.setValue("zonesPref");
    } else {
      this.view$ = of("stations");
      this.panelDisplay.setValue("stations");
    }
  }

  toPlatforms() {
    this.routerext.navigate(["platform"]);
  }

  toPlatform() {
    this.routerext.navigate(["platform/" + this.platform.code]);
  }

  openDialog() {
    this.fileNameDialogRef = this.dialog.open(zoneMapModal, {
      data: this.zone.staticmap
    });
  }
}

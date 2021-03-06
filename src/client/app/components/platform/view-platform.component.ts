import { Component, OnInit, OnDestroy, Output, Input, ChangeDetectionStrategy, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription, of, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { RouterExtensions, Config } from "../../modules/core/index";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { IAppState } from "../../modules/ngrx/index";

import { PlatformAction } from "../../modules/datas/actions/index";
import { User } from "../../modules/countries/models/country";
import { Platform, Zone, Survey, Station } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";
import { WindowService } from "../../modules/core/services/index";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-view-platform",
  templateUrl: "view-platform.component.html",
  styleUrls: ["view-platform.component.css"]
})
export class ViewPlatformComponent implements OnInit, OnDestroy {
  @Input() platform: Platform;
  @Input() msg: string | null;
  @Input() zones$: Observable<Zone[]>;
  @Input() stations$: Observable<Station[]>;
  @Input() surveys$: Observable<Survey[]>;
  @Input() countries: Country[];

  filteredZones$: Observable<Zone[]>;
  filteredStations$: Observable<Station[]>;
  filteredSurveys$: Observable<Survey[]>;
  filterFormControl = new FormControl("", []);
  @Output() remove = new EventEmitter<Platform>();
  @Output() action = new EventEmitter<String>();
  actionsSubscription: Subscription;
  view$: Observable<string>;
  panelDisplay = new FormControl("surveys");

  constructor(
    private translate: TranslateService,
    private store: Store<IAppState>,
    route: ActivatedRoute,
    public routerext: RouterExtensions,
    private windowService: WindowService
  ) {
    this.actionsSubscription = route.params.pipe(map(params => this.display(params.view))).subscribe();
  }

  ngOnInit() {
    this.filteredZones$ = this.zones$;
    this.filteredStations$ = this.stations$;
    this.filteredSurveys$ = this.surveys$;
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  deletePlatform() {
    let deleteMsg = this.translate.instant("CONFIRM_DELETE_PLATFORM");

    if (this.windowService.confirm(deleteMsg)) return this.remove.emit(this.platform);
  }

  filter(filter: string) {
    filter = filter.toLowerCase();
    switch (this.panelDisplay.value) {
      case "zones":
        this.filteredZones$ = this.zones$.pipe(
          map(zones =>
            zones.filter(
              zone =>
                zone.properties.code.toLowerCase().indexOf(filter) !== -1 ||
                zone.codePlatform.toLowerCase().indexOf(filter) !== -1 ||
                zone.properties.surface
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1
            )
          )
        );
        break;
      case "stations":
        this.filteredStations$ = this.stations$.pipe(
          map(stations =>
            stations.filter(
              station =>
                station.properties.code.toLowerCase().indexOf(filter) !== -1 ||
                station.codePlatform.toLowerCase().indexOf(filter) !== -1 ||
                station.properties.description
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1
            )
          )
        );
        break;

      default:
        this.filteredSurveys$ = this.surveys$.pipe(
          map(surveys =>
            surveys.filter(
              survey =>
                survey.code.toLowerCase().indexOf(filter) !== -1 ||
                survey.codePlatform.toLowerCase().indexOf(filter) !== -1 ||
                survey.dateStart
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1 ||
                survey.dateEnd
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1 ||
                survey.participants.toLowerCase().indexOf(filter) !== -1 ||
                survey.surfaceStation
                  .toString()
                  .toLowerCase()
                  .indexOf(filter) !== -1 ||
                survey.description.toLowerCase().indexOf(filter) !== -1
            )
          )
        );
        break;
    }
  }

  actions(type: string) {
    console.log(type);
    switch (type) {
      case "platformForm":
      case "zoneForm":
      case "zoneImport":
      case "stationForm":
      case "surveyForm":
      case "globalImport":
      case "surveyImport":
      case "stationImport":
      case "zonePrefImport":
      case "countImport":
        this.action.emit(type + "/" + this.platform._id);
        break;
      case "deletePlatform":
        this.deletePlatform();
        break;
      default:
        break;
    }
  }

  display(view: string) {
    if (view === "zones") {
      this.view$ = of(view);
      this.panelDisplay.setValue("zones");
    } else if (view === "stations") {
      this.view$ = of(view);
      this.panelDisplay.setValue("stations");
    } else {
      this.view$ = of("surveys");
      this.panelDisplay.setValue("surveys");
    }
  }

  toPlatforms() {
    this.routerext.navigate(["platform"]);
  }
}

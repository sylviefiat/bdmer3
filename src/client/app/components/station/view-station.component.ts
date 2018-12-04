import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { RouterExtensions, Config } from "../../modules/core/index";
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { IAppState } from "../../modules/ngrx/index";

import { PlatformAction } from "../../modules/datas/actions/index";
import { User } from "../../modules/countries/models/country";
import { Platform, Station, Count } from "../../modules/datas/models/index";
import { WindowService } from "../../modules/core/services/index";
import { stationMapModal } from "./station-map-modal.component";
import { Country } from "../../modules/countries/models/country";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-view-station",
  templateUrl: "view-station.component.html",
  styleUrls: ["view-station.component.css"]
})
export class ViewStationComponent implements OnInit {
  @Input() platform: Platform;
  @Input() station: Station;
  @Input() countries: Country[];
  @Output() remove = new EventEmitter<any>();
  @Output() action = new EventEmitter<String>();
  nCounts: number = 0;

  fileNameDialogRef: MatDialogRef<stationMapModal>;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private store: Store<IAppState>,
    public routerext: RouterExtensions,
    private windowService: WindowService
  ) {}

  ngOnInit() {
    this.nCounts = (<any>this.platform).surveys.flatMap(s => s.counts.filter(c => c.codeStation === this.station.properties.code)).length;
  }

  deleteStation() {
    let deleteMsg = this.translate.instant("CONFIRM_DELETE_STATION");
    if (this.windowService.confirm("Are you sure you want to delete this station from database ?")) {
      this.remove.emit(this.station);
    }
  }

  actions(type: string) {
    switch (type) {
      case "stationForm":
        this.action.emit(type + "/" + this.platform._id + "/" + this.station.properties.code);
        break;
      case "deleteStation":
        this.deleteStation();
        break;
      default:
        break;
    }
  }

  toPlatforms() {
    this.routerext.navigate(["platform"]);
  }

  toPlatform() {
    this.routerext.navigate(["platform/" + this.platform.code]);
  }
}

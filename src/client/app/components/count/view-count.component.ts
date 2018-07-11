import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { RouterExtensions, Config } from "../../modules/core/index";
import { TranslateService } from "@ngx-translate/core";

import { IAppState } from "../../modules/ngrx/index";

import { PlatformAction } from "../../modules/datas/actions/index";
import { User } from "../../modules/countries/models/country";
import { Platform, Zone, Station, Survey, Count, Species } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";
import { WindowService } from "../../modules/core/services/index";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-count",
  templateUrl: "view-count.component.html",
  styleUrls: ["view-count.component.css"]
})
export class ViewCountComponent implements OnInit {
  @Input() platform: Platform;
  @Input() survey: Survey;
  @Input() count: Count;
  @Input() countries: Country[];
  @Input() locale: string;
  @Input() species: Species[];
  @Output() remove = new EventEmitter<any>();
  @Output() action = new EventEmitter<string>();

  constructor(
    private translate: TranslateService,
    private store: Store<IAppState>,
    public routerext: RouterExtensions,
    private windowService: WindowService
  ) {}

  ngOnInit() {
    this.count.mesures = this.count.mesures.sort(
      (left, right) => (left.codeSpecies < right.codeSpecies ? -1 : left.codeSpecies > right.codeSpecies ? 1 : 0)
    );
  }

  getSpeciesName(code: string) {
    return this.species.filter(species => species.code === code)[0] ? this.species.filter(species => species.code === code)[0].scientificName : code;
  }

  writeSp(index: number) {
    return index === 0 || this.count.mesures[index].codeSpecies !== this.count.mesures[index - 1].codeSpecies;
  }

  getNMesuresSpecies(codeSpecies: string) {
    let mesSp = this.count.mesures && this.count.mesures.filter(count => count.codeSpecies === codeSpecies);
    return mesSp && mesSp.length;
  }

  deleteCount() {
    let confirmationMsg = this.translate.instant("CONFIRM_DELETE_COUNT");

    if (this.windowService.confirm(confirmationMsg.CONFIRM_DELETE_COUNT)) {
      this.remove.emit(this.count);
    }
  }

  actions(type: string) {
    console.log(type);
    switch (type) {
      case "countForm":
        this.action.emit(type + "/" + this.platform._id + "/" + this.survey.code + "/" + this.count.code);
        break;
      case "deleteCount":
        this.deleteCount();
        break;
      default:
        break;
    }
  }

  get monospecies() {
    return this.count.monospecies;
  }

  get mesures() {
    return this.count.mesures;
  }

  get nMesures() {
    return this.count.mesures && this.count.mesures.length;
  }

  get localDate() {
    switch (this.locale) {
      case "fr":
        return "dd-MM-yyyy";
      case "en":
      default:
        return "MM-dd-yyyy";
    }
  }

  get thumbnail(): string | boolean {
    // WAIT FOR MAP
    return null;
    //return "/assets/img/"+this.count.code+".jpg";
  }

  toPlatforms() {
    this.routerext.navigate(["platform"]);
  }

  toPlatform() {
    this.routerext.navigate(["platform/" + this.platform.code]);
  }

  toSurvey() {
    this.routerext.navigate(["survey/" + this.platform.code + "/" + this.survey.code]);
  }
}

import { Component, Input, Output, EventEmitter, OnInit, AfterViewChecked } from "@angular/core";
import { RouterExtensions, Config } from "../../modules/core/index";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Observable, pipe } from "rxjs";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

import { Country, User } from "./../../modules/countries/models/country";
import { WindowService } from "./../../modules/core/services/index";
import { IAppState, getPlatformInApp } from "../../modules/ngrx/index";
import { Platform } from "../../modules/datas/models/index";
import { PlatformAction } from "../../modules/datas/actions/index";

@Component({
  selector: "bc-country-detail",
  template: `
  <mat-card *ngIf="country" class="actions">
  <mat-card-title-group>
  <div>
  <mat-card-title><a class="link" (click)="toCountries()">{{ 'COUNTRY_LIST' | translate}}</a> / {{ name }}</mat-card-title>
  <mat-card-subtitle>{{ code }}</mat-card-subtitle>
  <mat-card-subtitle>{{ 'TYPE_PLATFORM' | translate }}: {{ type | translate }}</mat-card-subtitle>
  </div>
  <div>
  <img mat-card-sm-image *ngIf="flag" [src]="flag"/>
  </div>
  </mat-card-title-group>
  <mat-card-actions>
  <mat-form-field>
  <mat-select  placeholder="{{'ACTIONS' | translate}}" (selectionChange)="actions($event.value)">
  <mat-option [value]="'addUser'">{{ 'ADD_USER' | translate}}</mat-option>
  <mat-option *ngIf="isNotAdminCountry() && isAdmin" class="warn" [value]="'deleteCountry'">{{ 'DELETE_COUNTRY' | translate}}</mat-option>
  </mat-select>
  </mat-form-field>        
  </mat-card-actions> 
  <mat-card-content class="msg" *ngIf="msg" align="start">{{ msg | translate }}</mat-card-content> 
  </mat-card>
  <div class="inside">
  <bc-user-detail *ngFor="let user of users" [user]="user" [hasactions]="true"></bc-user-detail>
  <div *ngIf="noUsers">{{'NO_USERS' | translate}}</div>    
  </div>

  `,
  styles: [
    `
      mat-card {
        display: flex;
        flex-direction: column;
      }
      .msg {
        text-align: center;
        padding: 16px;
        color: white;
        background-color: #4bb543;
      }
      .actions {
      }
      mat-card-title-group {
        justify-content: space-evenly;
      }
      mat-card-title-group img {
        max-width: 100px;
        max-height: 70px;
        width: auto;
      }
      .inside {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        margin: 72px 0;
      }
      .inside mat-card {
        flex-grow: 1;
        margin: auto;
        min-width: 30%;
        text-align: left;
        padding: 1em 2em;
      }

      mat-card-title {
        font-style: italic;
      }
      mat-card-content {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
      }
      mat-card-content.one {
        display: flex;
        justify-content: start;
      }
      mat-card-actions {
        display: flex;
        justify-content: center;
      }
      mat-form-field {
        margin-left: 50px;
      }
      .warn:hover {
        background-color: #d9534f;
      }
      .link {
        cursor: pointer;
        text-decoration: underline;
      }
    `
  ]
})
export class CountryDetailComponent implements OnInit {
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() country: Country;
  @Input() platforms: Platform[];
  @Input() isAdmin: boolean;
  @Input() msg: string;
  @Input() platformTypeList: any[];
  @Output() removecountry = new EventEmitter();
  stringDelete: string;

  constructor(
    private translate: TranslateService,
    private store: Store<IAppState>,
    private sanitizer: DomSanitizer,
    public routerext: RouterExtensions,
    public activatedRoute: ActivatedRoute,
    private windowService: WindowService
  ) {}

  ngOnInit() {
    let confirmationMsg = this.translate.instant(["CONFIRM_DELETE_COUNTRY", "ALSO_DELETE"]);

    this.stringDelete = confirmationMsg.CONFIRM_DELETE_COUNTRY;
    for (let i = 0; i < this.platforms.length; i++) {
      if (i == 0) {
        if (i == this.platforms.length - 1) {
          this.stringDelete += confirmationMsg.ALSO_DELETE + this.platforms[i].code + ".";
        } else {
          this.stringDelete += confirmationMsg.ALSO_DELETE + this.platforms[i].code + ",";
        }
      } else if (i == this.platforms.length - 1 && i != 0) {
        this.stringDelete += " " + this.platforms[i].code + ".";
      } else {
        this.stringDelete += ", " + this.platforms[i].code;
      }
    }
  }

  get id() {
    return this.country._id;
  }

  get name() {
    return this.country.name;
  }

  get code() {
    return this.country.code;
  }

  get type() {
    return this.platformTypeList.filter(pt => Number(pt.id)===Number(this.country.platformType))[0] ? this.platformTypeList.filter(pt => Number(pt.id)===Number(this.country.platformType))[0].value : 'NONE';
  }

  get users() {
    return this.country.users;
  }

  get noUsers() {
    return !this.country.users || this.country.users.length <= 0;
  }

  get flag() {
    if (this.country.flag) {
      const flag = this.country.flag;
      return this.sanitizer.bypassSecurityTrustResourceUrl(flag);
    } else {
      return this.country.flag;
    }
  }

  actions(action: string) {
    switch (action) {
      case "addUser":
        this.addUser();
        break;
      case "deleteCountry":
        this.deleteCountry();
        break;
      default:
        break;
    }
  }

  toCountries() {
    this.routerext.navigate(["countries"]);
  }

  addUser() {
    this.routerext.navigate(["userForm"], {
      relativeTo: this.activatedRoute,
      transition: {
        duration: 1000,
        name: "slideTop"
      }
    });
  }

  isNotAdminCountry(): boolean {
    return this.country.code !== "AA";
  }

  deleteCountry() {
    if (this.windowService.confirm(this.stringDelete)) {
      return this.removecountry.emit({ country: this.country, platforms: this.platforms });
    }
  }
}

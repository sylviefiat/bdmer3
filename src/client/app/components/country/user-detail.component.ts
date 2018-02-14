import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../modules/ngrx/index';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';

import { User } from './../../modules/countries/models/country';
import { CountryAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-user-detail',
  template: `
    <mat-card>
      <mat-card-title-group>
        <mat-card-title>{{ firstname }} {{lastname}}</mat-card-title>
        <mat-card-subtitle>{{ username }}</mat-card-subtitle>
      </mat-card-title-group>
      <mat-card-content *ngIf="email">
        <a *ngIf="hasactions" href="mailto:{{email}}">
          <fa [name]="'envelope'" [border]=false [size]=1></fa> {{email}}
        </a>
      </mat-card-content>
      <mat-card-actions *ngIf="hasactions">
        <button (click)="editUser()"> 
          <fa [name]="'edit'" [border]=false [size]=1></fa> {{'EDIT' | translate}}
        </button>
        <button *ngIf="isNotAdmin()" class="warn" (click)="removeUserFromCountry()" >
          <fa [name]="'trash'" [border]=false [size]=1></fa> {{'DELETE' | translate}}
        </button>
      </mat-card-actions>
    </mat-card>

  `,
  styles: [
    `
    mat-card {
      width: 400px;
      height: 300px;
      margin: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    @media only screen and (max-width: 768px) {
      mat-card {
        margin: 15px 0 !important;
      }
    }
    mat-card:hover {
      box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, .5);
    }
    mat-card-title {
      margin-right: 10px;
    }
    mat-card-title-group {
      margin: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: auto !important;
      margin-left: 5px;
    }
    mat-card-content {
      margin-top: 15px;
      margin: 15px 0 0;
    }
    mat-card-actions {
      justify-content: space-evenly;
      display: flex;
    }
    .warn {
       background-color: #d9534f;
    }
  `,
  ],
})
export class UserDetailComponent {
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() user: User;
  @Input() hasactions: boolean;

  constructor(private store: Store<IAppState>, public activatedRoute: ActivatedRoute, public routerext: RouterExtensions){}

  /**
   * Tip: Utilize getters to keep templates clean
   */
 
  get firstname() {
    return this.user.surname;
  }

  get lastname() {
    return this.user.name;
  }

  get username() {
    return this.user.username;
  }

  get email() {
    return this.user.email;
  }

  editUser() {
    this.routerext.navigate(['userForm/'+this.user.username], {
      relativeTo: this.activatedRoute,
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }

  removeUserFromCountry() {
    this.store.dispatch(new CountryAction.RemoveUserAction(this.user));
  }

  isNotAdmin() {
    return this.user.username!=='admin';
  }
}

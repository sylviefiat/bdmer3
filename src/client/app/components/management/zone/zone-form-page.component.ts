import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Site, Zone } from '../../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';

@Component({
  selector: 'bc-zone-page',
  template: `
    <bc-zone-form-page
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async">
    </bc-zone-form-page>
  `,
  styles: [
    `
    #zone-page {
      display: flex;
      flex-direction:row;
      justify-content: center;
      margin: 72px 0;
    }
    md-card {
      min-width: 500px;
    }
    
    .toolbar {
      background-color: #106cc8;
      color: rgba(255, 255, 255, 0.87);
      display: block;
      padding:10px;
    }
    `]
})
export class ZoneFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  site$: Observable<Site>;
  zone$: Observable<Zone | null>;
  actionsSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.actionsSubscription = route.params
      .map(params => new SiteAction.SelectAction(params.idsite))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.site$
      .do(site => console.log(site))
      .mergeMap((site: Site) =>
        this.route.params.map(params => params.idzone)
          .mergeMap(idzone => {
            return of(site.zones.filter(zone => zone.code === idzone)[0])
          })
          .mergeMap((zone: Zone) => {
            return of(zone);
          })
      )
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  onSubmit(zone: Zone) { 
      this.store.dispatch(new SiteAction.AddZoneAction(zone))    
  }

  return() {
    this.routerext.navigate(['/management/'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}
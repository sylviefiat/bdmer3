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
    <div id="zone-page">
      <md-card>
        <md-card-title class="toolbar"><fa [name]="'street-view'" [border]=true [size]=1 ></fa>Add/Edit Zone</md-card-title>
      
      <bc-zone-form
        (submitted)="onSubmit($event)"
        [errorMessage]="error$ | async"
        [site]="site$ | async"
        [zone]="zone$ | async"
        [zoneForm]="zoneForm">
      </bc-zone-form>
      <div class="actions">
            <button (click)="submit()" class="btn btn-primary" [disabled]="!zoneForm.valid">Submit</button>
            <button (click)="return()" class="btn btn-secondary">Cancel</button>
      </div>
      </md-card>
    </div>
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
  @Input() site: Site;

  zoneForm: FormGroup = new FormGroup({
    code: new FormControl("", Validators.required),
    surface: new FormControl(""),
    transects: this._fb.array([]),
    zonePreferences: this._fb.array([]),
  });

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.actionsSubscription = route.params
      .map(params => new SiteAction.SelectAction(params.idsite))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.site$
      .mergeMap((site: Site) =>
        this.route.params.map(params => params.idzone)
          .mergeMap(idzone => {
            return of(site.zones.filter(zone => zone.code === idzone)[0])
          })
          .mergeMap((zone: Zone) => {
            console.log(site);
            if (zone) {
              this.zoneForm.controls.code.setValue(zone.code);
              this.zoneForm.controls.surface.setValue(zone.surface);
            } else {
              this.zoneForm.controls.code.setValue(site.code + "_Z");
            }
            return of(zone);
          })
      )
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  submit() { 
    this.site$.subscribe(site => {
      console.log(site);
      return this.store.dispatch(new SiteAction.AddZoneAction({ site: site, zone: this.zoneForm.value }))
    }
   )
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
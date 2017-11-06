import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'bc-zone-form-page',
  template: `
      <md-card>
        <md-card-title class="toolbar"><fa [name]="'street-view'" [border]=true [size]=1 ></fa>Add/Edit Zone</md-card-title>
      <form (ngSubmit)="submit()">
      <bc-zone-form
        [errorMessage]="error$ | async"
        [site]="site$ | async"
        [zone]="zone$ | async"
        [zoneForm]="zoneForm">
      </bc-zone-form>
      <div class="actions">
            <button type="submit" class="btn btn-primary" [disabled]="!zoneForm.valid">Submit</button>
            <button (click)="return()" class="btn btn-secondary">Cancel</button>
      </div>
      </form>
      </md-card>
  `,
  styles: [
    `
    :host {
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
export class ZoneFormFormComponent implements OnInit {
  @Input() site: Site;
  @Input() zone: Zone;
  @Input() errorMessage: string | null;
  
  @Output() submitted = new EventEmitter<{ site, zone }>();

  zoneForm: FormGroup = new FormGroup({
    code: new FormControl("", Validators.required),
    surface: new FormControl(""),
    transects: this._fb.array([]),
    zonePreferences: this._fb.array([]),
  });

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {

  }

  ngOnInit() {
    if (this.zone !== null) {
      this.zoneForm.controls.code.setValue(this.zone.code);
      this.zoneForm.controls.surface.setValue(this.zone.surface);
    } else {
      this.zoneForm.controls.code.setValue(this.site.code + "_Z");
    }
  }

  submit() {
    this.submitted.emit({ site:this.site, zone:this.zoneForm.value });
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
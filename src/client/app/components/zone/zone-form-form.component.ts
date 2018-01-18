import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-zone-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <mat-card>
        <mat-card-title class="toolbar"><fa [name]="'street-view'" [border]=true [size]=1 ></fa>{{ 'ADD_ZONE' | translate}}</mat-card-title>
      <form (ngSubmit)="submit()">
      <bc-zone-form
        [errorMessage]="errorMessage"
        [site]="site"
        [zone]="zone"
        [zoneForm]="zoneForm">
      </bc-zone-form>
      <div class="actions">
            <button type="submit" class="btn btn-primary" [disabled]="!zoneForm.valid">{{ 'SUBMIT' | translate}}</button>
            <button (click)="return()" class="btn btn-secondary">{{ 'BACK_MANAGEMENT' | translate}}</button>
      </div>
      </form>
      </mat-card>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-direction:row;
      justify-content: center;
      margin: 72px 0;
    }
    mat-card {
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
  
  @Output() submitted = new EventEmitter<any>();

  zoneForm: FormGroup = new FormGroup({
    code: new FormControl("", Validators.required),
    surface: new FormControl(""),
    transects: this._fb.array([]),
    zonePreferences: this._fb.array([]),
  });

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {

  }

  ngOnInit() {
    if (!this.zone) {
      this.zoneForm.controls.code.setValue(this.site.code + "_Z");
    } else {
      this.zoneForm.controls.code.setValue(this.zone.code);
      this.zoneForm.controls.surface.setValue(this.zone.surface);
    }  
  }

  submit() {
    this.submitted.emit(this.zoneForm.value);
  }

  return() {
    this.routerext.navigate(['/site/'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}
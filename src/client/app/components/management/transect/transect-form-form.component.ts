import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Site, Zone, Transect } from '../../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';

@Component({
  selector: 'bc-transect-form-page',
  template: `
      <mat-card>
        <mat-card-title class="toolbar"><fa [name]="'arrow-h'" [border]=true [size]=1 ></fa>{{ 'ADD_TRANSECT' | translate}}</mat-card-title>
      <form (ngSubmit)="submit()">
      <bc-transect-form
        [errorMessage]="errorMessage"
        [site]="site"
        [zone]="zone"
        [transect]="transect"
        [transectForm]="transectForm">
      </bc-transect-form>
      <div class="actions">
            <button type="submit" class="btn btn-primary" [disabled]="!transectForm.valid">{{ 'SUBMIT' | translate}}</button>
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
export class TransectFormFormComponent implements OnInit {
  @Input() site: Site;
  @Input() zone: Zone;
  @Input() transect: Transect;
  @Input() errorMessage: string | null;
  
  @Output() submitted = new EventEmitter<any>();

  transectForm: FormGroup = new FormGroup({
    code: new FormControl("", Validators.required),
    longitude: new FormControl(""),
    latitude: new FormControl(""),
    counts: this._fb.array([])
  });

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {

  }

  ngOnInit() {
    if (!this.transect) {
      this.transectForm.controls.code.setValue(this.zone.code + "_T");
    } else {
      this.transectForm.controls.code.setValue(this.transect.code);
      this.transectForm.controls.longitude.setValue(this.transect.longitude);
      this.transectForm.controls.latitude.setValue(this.transect.latitude);
    }  
  }

  submit() {
    this.submitted.emit(this.transectForm.value);
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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, ZonePreference } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-zone-pref-form-page',
  template: `
      <mat-card>
        <mat-card-title class="toolbar"><fa [name]="'arrow-h'" [border]=true [size]=1 ></fa>{{ 'ADD_ZONE_PREF' | translate}}</mat-card-title>
      <form (ngSubmit)="submit()">
      <bc-zone-pref-form
        [errorMessage]="errorMessage"
        [site]="site"
        [zone]="zone"
        [zonePref]="zonePref"
        [zonePrefForm]="zonePrefForm">
      </bc-zone-pref-form>
      <div class="actions">
            <button type="submit" class="btn btn-primary" [disabled]="!zonePrefForm.valid">{{ 'SUBMIT' | translate}}</button>
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
export class PreferenceAreaFormFormComponent implements OnInit {
  @Input() site: Site;
  @Input() zone: Zone;
  @Input() zonePref: ZonePreference;
  @Input() errorMessage: string | null;
  
  @Output() submitted = new EventEmitter<any>();

  zonePrefForm: FormGroup = new FormGroup({
    code: new FormControl("", Validators.required),
    codeZone: new FormControl(""),
    date: new FormControl(""),
    codeSpecies: new FormControl(""),
    presence: new FormControl(""),
    infoSource: new FormControl("")    
  });

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {

  }

  ngOnInit() {
    if (!this.zonePref) {
      this.zonePrefForm.controls.code.setValue(this.zone.code + "_ZP");
    } else {
      this.zonePrefForm.controls.code.setValue(this.zonePref.code);
      this.zonePrefForm.controls.codeZone.setValue(this.zonePref.codeZone);
      this.zonePrefForm.controls.codeSpecies.setValue(this.zonePref.codeSpecies);
      this.zonePrefForm.controls.presence.setValue(this.zonePref.presence);
      this.zonePrefForm.controls.infoSource.setValue(this.zonePref.infoSource);
    }  
  }

  submit() {
    this.submitted.emit(this.zonePrefForm.value);
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
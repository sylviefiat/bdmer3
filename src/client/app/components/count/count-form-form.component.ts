import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, Transect, Count } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-count-form-page',
  template: `
      <mat-card>
        <mat-card-title class="toolbar"><fa [name]="'arrow-h'" [border]=true [size]=1 ></fa>{{ 'ADD_TRANSECT' | translate}}</mat-card-title>
      <form (ngSubmit)="submit()">
      <bc-count-form
        [errorMessage]="errorMessage"
        [site]="site"
        [zone]="zone"
        [transect]="transect"
        [count]="count"
        [countForm]="countForm">
      </bc-count-form>
      <div class="actions">
            <button type="submit" class="btn btn-primary" [disabled]="!countForm.valid">{{ 'SUBMIT' | translate}}</button>
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
export class CountFormFormComponent implements OnInit {
  @Input() site: Site;
  @Input() zone: Zone;
  @Input() transect: Transect;
  @Input() count: Count;
  @Input() errorMessage: string | null;
  
  @Output() submitted = new EventEmitter<any>();

  countForm: FormGroup = new FormGroup({
    code: new FormControl("", Validators.required),
    codeCampagne: new FormControl(""),
    codeSite: new FormControl(""),
    codeZone: new FormControl(""),
    nomTransect: new FormControl(""),
    codeTransect: new FormControl(""),
    date: new FormControl(""),
    codeSpecies: new FormControl(""),
    mesures: new FormControl("")
  });

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {

  }

  ngOnInit() {
    if (!this.transect) {
      this.countForm.controls.code.setValue(this.transect.code + "_C");
    } else {
      this.countForm.controls.code.setValue(this.count.code);
      this.countForm.controls.codeCampagne.setValue(this.count.codeCampagne);
      this.countForm.controls.codeSite.setValue(this.count.codeSite);
      this.countForm.controls.codeZone.setValue(this.count.codeZone);
      this.countForm.controls.nomTransect.setValue(this.count.nomTransect);
      this.countForm.controls.codeTransect.setValue(this.count.codeTransect);
      this.countForm.controls.date.setValue(this.count.date);
      this.countForm.controls.codeSpecies.setValue(this.count.codeSpecies);
      this.countForm.controls.mesures.setValue(this.count.mesures);
    }  
  }

  submit() {
    this.submitted.emit(this.countForm.value);
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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState, getSpeciesInApp } from '../../../modules/ngrx/index';

import { SpeciesAction } from '../../../modules/datas/actions/index';
import { Species } from '../../../modules/datas/models/species';

@Component({
  moduleId: module.id,
  selector: 'bc-new-species-form',
  templateUrl: 'new-species.component.html',
  styleUrls: [
    'new-species.component.css',
  ],
})
export class NewSpeciesComponent implements OnInit {
  public species$: Observable<Species[]>;

  @Input() errorMessage: string | null;


  @Output() submitted = new EventEmitter<Species>();

  form: FormGroup = new FormGroup({
    code: new FormControl('',Validators.required),
    scientificName: new FormControl('',Validators.required),
    names: this._fb.array([]),
    LLW:this._fb.group({
      coefA: new FormControl(''),
      coefB: new FormControl(''),
    }),
    LW: this._fb.group({
      coefA: new FormControl(''),
      coefB: new FormControl(''),
    }),
    conversions: this._fb.group({
      salt: new FormControl(''),
      BDM: new FormControl(''),
    }),
    biologicDimensions: this._fb.group({
      longMax: new FormControl(''),
      largMax: new FormControl(''),
    }),
    distribution: new FormControl(''),
    habitatPreference: new FormControl(''),
    legalDimensions: this._fb.array([]),
  });

  constructor(private store: Store<IAppState>, private sanitizer: DomSanitizer, private _fb: FormBuilder) { }

  ngOnInit() {
    this.addName();
    this.addLegalDim();
    this.species$ = this.store.let(getSpeciesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  initName() {
    return this._fb.group({
      lang: new FormControl(''),
      name: new FormControl('')
    });
  }

  addName() {
    const control = <FormArray>this.form.controls['names'];
    const addrCtrl = this.initName();

    control.push(addrCtrl);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  removeName(i: number) {
    const control = <FormArray>this.form.controls['names'];
    control.removeAt(i);
  }

  initLegalDim() {
    return this._fb.group({
      countryCode: new FormControl(''),
      longMin: new FormControl(''),
      largMin: new FormControl(''),
    });
  }

  addLegalDim() {
    const control = <FormArray>this.form.controls['legalDimensions'];
    const addrCtrl = this.initName();

    control.push(addrCtrl);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  removeLegalDim(i: number) {
    const control = <FormArray>this.form.controls['legalDimensions'];
    control.removeAt(i);
  }

  submit() {
    if (this.form.valid) {
      console.log(this.submitted);
      this.submitted.emit(this.form.value);
    }
  }

}
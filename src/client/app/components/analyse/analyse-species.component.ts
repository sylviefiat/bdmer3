import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Species } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-species',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_MANY_SPECIES' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="species">
        <div *ngFor="let species of species$ | async; let i=index">
          <bc-species [group]="form.controls.species.controls[i]" [species]="species" (speciesEmitter)="changeValue($event)"></bc-species>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
    .species {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    `]
})
export class AnalyseSpeciesComponent implements OnInit {
  @Input() species$: Observable<Species[]>;
  defaultSpecies: Species[] = [];
  checkedSpecies: Species[] = [];
  @Output() speciesEmitter = new EventEmitter<Species[]>();
  @Input('group') public form: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    this.initSpecies();
  }

  newSpecies(s: Species) {
    return this._fb.group({
      species: new FormControl(this.checkedSpecies.filter(species => species.code === s.code).length > 0)
    });
  }

  initSpecies() {
    this.species$
      .filter(species => species !== null)
      .subscribe(species => {
        this.defaultSpecies=[];
        this.form.controls['species'] = this._fb.array([]);
        for (let sp of species) {
          this.defaultSpecies.push(sp);
          const control = <FormArray>this.form.controls['species'];
          control.push(this.newSpecies(sp));
        }
      })
  }

  changeValue(spCheck: any) {
    console.log(spCheck);
    this.checkedSpecies=[...this.checkedSpecies.filter(s => s.code!==spCheck.species.code)];
    if(spCheck.checked){
      this.checkedSpecies.push(spCheck.species);
    }
    this.speciesEmitter.emit(this.checkedSpecies);
  }

  checkAll(ev) {
    const control = <FormArray>this.form.controls['species'];
    control.value.forEach(x => x.species = ev.checked)
    control.setValue(control.value);
    this.checkedSpecies=(ev.checked)?this.defaultSpecies:[];
    this.speciesEmitter.emit(this.checkedSpecies);
  }

}

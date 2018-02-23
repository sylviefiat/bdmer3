import { Component, OnInit,OnDestroy, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { IAppState } from '../../modules/ngrx/index';

import { AnalyseAction } from '../../modules/analyse/actions/index';
import { Country } from '../../modules/countries/models/country';
import { Site, Zone, Campaign } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-analyse',
    templateUrl: 'analyse.component.html',
    styleUrls: [
    'analyse.component.css',
    ],
})
export class AnalyseComponent implements OnInit, OnDestroy {
    @Input() msg: string | null;
    @Input() countries: Country[];
    @Input() isAdmin: boolean;
    @Output() analyse = new EventEmitter<String>();
    step = 0;


    constructor(private store: Store<IAppState>, route: ActivatedRoute,public routerext: RouterExtensions) { 
        
    }

    ngOnInit() {   
    }

    ngOnDestroy() {
    }

    setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
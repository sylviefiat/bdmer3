import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { PlatformAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Platform, Survey, Count, Species } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-view-survey',
    templateUrl: 'view-survey.component.html',
    styleUrls: [
        'view-survey.component.css',
    ],
})
export class ViewSurveyComponent implements OnInit {    
    @Input() platform: Platform;
    @Input() survey: Survey;
    @Input() locale: String;
    @Input() species: Species[];
    @Input() counts$: Observable<Count[]>;
    filteredCounts$: Observable<Count[]>;
    filterFormControl = new FormControl('', []);
    @Output() remove = new EventEmitter<any>();
    @Output() action = new EventEmitter<string>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        this.filteredCounts$ = this.counts$;
    }


    deleteSurvey() {
        if (this.windowService.confirm("Are you sure you want to delete this survey from database ?")){
            this.remove.emit(this.survey);
        }
    }

    filter(filter: string){
        filter=filter.toLowerCase();
        console.log();
        this.filteredCounts$ = this.counts$.map(counts => 
                    counts.filter(count => count.code.toLowerCase().indexOf(filter)!==-1 || 
                        count.codePlatform.toLowerCase().indexOf(filter)!==-1 || 
                        count.codeSurvey.toLowerCase().indexOf(filter)!==-1 ||
                        count.codeStation.toLowerCase().indexOf(filter)!==-1 ||
                        count.date.toString().toLowerCase().indexOf(filter)!==-1 ||
                        count.mesures.filter(mesure => 
                            this.species.filter(sp => sp.code===mesure.codeSpecies && 
                                sp.scientificName.toLowerCase().indexOf(filter)!==-1).length >0).length>0
                        )
                    );                      
    }

    actions(type: string) {
        switch (type) {
            case "surveyForm":
            case "countForm":
            case "countImport":
                this.action.emit(type+'/'+this.platform._id+"/"+this.survey.code);
                break;
            case "deleteSurvey":
                this.deleteSurvey();
                break;
            default:
                break;
        }
        
    }

    toPlatforms(){
        this.routerext.navigate(['platform']);
    }

    toPlatform(){
        this.routerext.navigate(['platform/'+this.platform.code]);
    }

      get localDate(){
        switch (this.locale) {
          case "fr":
            return 'dd-MM-yyyy';
          case "en":
          default:
            return 'MM-dd-yyyy';
        }
      }

}
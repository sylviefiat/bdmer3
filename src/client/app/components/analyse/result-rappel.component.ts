
import { Component, Inject, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { IAnalyseState } from '../../modules/analyse/states/index';
import { MapService } from '../../modules/core/services/index';
import { ResultRappelDialogComponent } from './result-rappel-dialog.component';

export interface DialogData {
  analyseData: IAnalyseState;
  locale: string;
}

@Component({
  selector: 'bc-result-rappel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `    
    <button mat-raised-button (click)="openRappel()">{{ 'SHOW_RECAP' | translate }}</button>
  `,
  styles: [
    `
    
  `]
})
export class ResultRappelComponent implements OnInit {
  @Input() analyseData: IAnalyseState;
  @Input() locale: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  openRappel(analyseData,locale): void {
    const dialogRef = this.dialog.open(ResultRappelDialogComponent, {
      width: '90vw',
      data: {analyseData: this.analyseData, locale: this.locale}
    });
  }

}


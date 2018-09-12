import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState,isLoading } from '../modules/ngrx/index';

@Component({
  moduleId: module.id,
  selector: 'sd-loader',
  template: `
      <div *ngIf="!(loaded$ | async)" class="lds-dual-ring"></div>
  `,
  styles: [`
  div {
      width: 100vw !important;
      height: 100vh !important;
      background-color: rgba(55,55,55,0.3);
      display: flex !important;
      align-items: center;
      justify-content: center;
      position: fixed;
      top:0;
      left:0;
  }
  .lds-dual-ring {      
      display: inline-block;
      width: 64px;
      height: 64px;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 46px;
      height: 46px;
      margin: 1px;
      border-radius: 50%;
      border: 5px solid #fff;
      border-color: #fff transparent #fff transparent;
      animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoaderComponent implements OnInit {
    loaded$: Observable<boolean>;

    constructor(private store: Store<IAppState>) { }
    ngOnInit() {
        this.loaded$ = this.store.select(isLoading);
    }
}
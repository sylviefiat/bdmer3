import { Component, Output, OnInit, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'bt-chips',
  template: `
    <mat-chip-list>
      <mat-chip color="accent"><a [routerLink]="['.']" fragment="top">{{ 'TOP' | translate }}</a></mat-chip>
      <mat-chip selected="{{isCurrent('SPECIES_NOMS')}}"><a [routerLink]="['.']" fragment="SPECIES_NOMS">{{ 'SPECIES_NOMS' | translate }}</a></mat-chip>
      <mat-chip selected="{{isCurrent('SPECIES_COEFS')}}"><a [routerLink]="['.']" fragment="SPECIES_COEFS">{{ 'SPECIES_COEFS' | translate }}</a></mat-chip>
      <mat-chip selected="{{isCurrent('SPECIES_CONVERSIONS')}}"><a [routerLink]="['.']" fragment="SPECIES_CONVERSIONS">{{ 'SPECIES_CONVERSIONS' | translate }}</a></mat-chip>
      <mat-chip selected="{{isCurrent('SPECIES_VIE')}}"><a [routerLink]="['.']" fragment="SPECIES_VIE">{{ 'SPECIES_VIE' | translate }}</a></mat-chip>
      <mat-chip selected="{{isCurrent('SPECIES_FISHING_DIMS')}}"><a [routerLink]="['.']" fragment="SPECIES_FISHING_DIMS">{{ 'SPECIES_FISHING_DIMS' | translate }}</a></mat-chip>
      <mat-chip class="send"><a (click)="submit()">{{ 'SUBMIT' | translate }}</a></mat-chip>
    </mat-chip-list>    
  `,
  styles: [
    `
    :host {
      margin: auto;
      
    }
    .mat-chip a {
      color: rgba(0,0,0,.87);
      text-decoration: none;
    }
    .mat-chip.mat-chip-selected.mat-primary a {
      color: white;
      text-decoration: none;
    }
    mat-chip.mat-accent {
      background-color: darkgrey;
    }
    mat-chip.send {
      background-color: #106cc8;
    }
    mat-chip.send a {
      color: white;
      cursor: pointer;
    }
  `,
  ],
})
export class ChipsComponent implements OnInit, AfterViewChecked {
  private current: string;
  private fragment: string;
  @Output() send = new EventEmitter<any>();

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; })

  }

  ngAfterViewChecked(): void {
    try {
      if(this.fragment === 'top'){
        window.scrollTo(0, 0);
      } else {
        document.querySelector('#' + this.fragment).scrollIntoView();
      }
    } catch (e) { }
  }

  isCurrent(anchorName: string): boolean {
    return this.fragment === anchorName;
  }

  submit(){
    this.send.emit();
  }
}
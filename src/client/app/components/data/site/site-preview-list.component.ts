import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Site } from './../../../modules/datas/models/site';

@Component({
  selector: 'bc-site-preview-list',
  template: `
    <bc-site-preview *ngFor="let site of siteList" [site]="site"></bc-site-preview>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `,
  ],
})
export class SitePreviewListComponent implements OnInit, AfterViewChecked {
  @Input() siteList: Site[];

  ngOnInit(){
    console.log(this.siteList);
  }

  ngAfterViewChecked(){
    console.log(this.siteList);
  }
 
}

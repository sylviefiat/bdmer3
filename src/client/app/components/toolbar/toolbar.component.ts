import { Component } from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: [
    'toolbar.component.css',
  ],
})
export class ToolbarComponent {

  constructor() {}

  public openLanguages(e: any): void {
    //console.log('openLanguages');
  }
}

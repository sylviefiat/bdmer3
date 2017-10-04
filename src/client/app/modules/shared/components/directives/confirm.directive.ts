import { Directive, Output, HostListener, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
//import $ from 'jquery';
//declare var $ :any;


@Directive({ 
  selector: '[confirm]' 
})
export class ConfirmDirective {

  @Output('confirm-click') click: any = new EventEmitter();

  @HostListener('click', ['$event']) 
  public clicked(e) {
    console.log(e);
    $.confirm({
      buttons: {
        confirm: () => this.click.emit(),
        cancel: () => {}
      }
    });
  }

}
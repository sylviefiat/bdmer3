import { Component, Input, AfterViewChecked } from '@angular/core';
import { Book } from './../../modules/books/models/book';

@Component({
  selector: 'bc-book-preview-list',
  template: `
    <bc-book-preview *ngFor="let book of books" [book]="book"></bc-book-preview>
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
export class BookPreviewListComponent/* implements AfterViewChecked*/ {
  @Input() books: Book[];
 
  /*ngAfterViewChecked() {     
    console.log(this.books);   
  }*/
}

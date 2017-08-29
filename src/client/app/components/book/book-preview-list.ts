import { Component, Input } from '@angular/core';
import { Book } from './../../modules/books/models/book';

@Component({
  selector: 'bc-book-preview-list',
  template: `
    <h3>Collection</h3>
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
export class BookPreviewListComponent {
  @Input() books: Book[];
}

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'bc-book-search',
  template: `
    <mat-card>
      <mat-card-title>Find a Book</mat-card-title>
      <mat-card-content>
        <mat-input-container>
          <input matInput placeholder="Search for a book" [value]="query" (keyup)="search.emit($event.target.value)">
        </mat-input-container>
        <mat-spinner [class.show]="searching"></mat-spinner>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
    mat-card-title,
    mat-card-content {
      display: flex;
      justify-content: center;
    }

    input {
      width: 300px;
    }

    mat-card-spinner {
      padding-left: 60px; // Make room for the spinner
    }

    mat-spinner {
      width: 30px;
      height: 30px;
      position: relative;
      top: 10px;
      left: 10px;
      opacity: 1.0;
    }

    mat-spinner.show {
      opacity: 1.0;
    }
  `,
  ],
})
export class BookSearchComponent {
  @Input() query = '';
  @Input() searching = false;
  @Output() search = new EventEmitter<string>();
  
}

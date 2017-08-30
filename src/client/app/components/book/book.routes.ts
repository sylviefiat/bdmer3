import { CollectionPageComponent } from './collection-page';
import { ViewBookPageComponent } from './view-book-page';
import { FindBookPageComponent } from './find-book-page';

export const BookRoutes: Array<any> = [
  {
    path: 'books',
    component: CollectionPageComponent
  },
  {
    path: 'find',
    component: FindBookPageComponent
  },
  {
    path: 'books/:id',
    component: ViewBookPageComponent
  },
];

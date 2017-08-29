import { CollectionPageComponent } from './collection-page';
import { ViewBookPageComponent } from './view-book-page';

export const BookRoutes: Array<any> = [
  {
    path: 'books',
    component: CollectionPageComponent
  },
  {
    path: 'books/:id',
    component: ViewBookPageComponent
  },
];

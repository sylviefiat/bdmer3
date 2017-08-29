import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NotFoundPageComponent } from './not-found-page';

import { AddCommasPipe } from './pipes/add-commas';
import { EllipsisPipe } from './pipes/ellipsis';

export const SHARED_COMPONENTS: any[] = [
  NavbarComponent,
  ToolbarComponent,
  NotFoundPageComponent,
  AddCommasPipe, 
  EllipsisPipe
];

export * from './navbar/navbar.component';
export * from './toolbar/toolbar.component';
export * from './not-found-page';
export * from './pipes/add-commas';
export * from './pipes/ellipsis';

import { NotFoundPageComponent } from './not-found-page';

import { AddCommasPipe } from './pipes/add-commas';
import { EllipsisPipe } from './pipes/ellipsis';
import { KeysPipe } from './pipes/keys';
import { HasIntersection } from './pipes/has-intersection';

export const SHARED_COMPONENTS: any[] = [
  NotFoundPageComponent,
  AddCommasPipe, 
  EllipsisPipe,
  KeysPipe,
  HasIntersection,
];

export * from './not-found-page';
export * from './pipes/add-commas';
export * from './pipes/ellipsis';
export * from './pipes/keys';
export * from './pipes/has-intersection';

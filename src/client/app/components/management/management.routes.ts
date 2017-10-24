
import { ManagementPageComponent } from './management-page.component';
import { SpeciesFormPageComponent } from './species/species-form-page.component';
import { SpeciesImportPageComponent } from './species/species-import-page.component';
import { ViewSpeciesPageComponent } from './species/view-species-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const ManagementRoutes: Array<any> = [
  {
    path: 'management',
    component: ManagementPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'speciesForm',
    component: SpeciesFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'speciesForm/:id',
    component: SpeciesFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'speciesImport',
    component: SpeciesImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'species/:id',
    component: ViewSpeciesPageComponent,
    canActivate : [AuthGuard]
  },
];

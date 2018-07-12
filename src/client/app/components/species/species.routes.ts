import { SpeciesListPageComponent } from './species-list-page.component';
import { SpeciesFormPageComponent } from './species-form-page.component';
import { SpeciesImportPageComponent } from './species-import-page.component';
import { ViewSpeciesPageComponent } from './view-species-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const SpeciesRoutes: Array<any> = [
  {
    path: 'species',
    component: SpeciesListPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }, {
    path: 'speciesForm',
    component: SpeciesFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'speciesForm/:id',
    component: SpeciesFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'speciesImport',
    component: SpeciesImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'species/:id',
    component: ViewSpeciesPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
]
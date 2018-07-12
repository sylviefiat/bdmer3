import { CountFormPageComponent } from './count-form-page.component';
import { CountImportPageComponent } from './count-import-page.component';
import { ViewCountPageComponent } from './view-count-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const CountRoutes: Array<any> = [
  
  {
    path: 'count/:idPlatform/:idSurvey/:idCount',
    component: ViewCountPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'countForm/:idPlatform/:idSurvey',
    component: CountFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },{
    path: 'countForm/:idPlatform/:idSurvey/:idCount',
    component: CountFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'countImport/:idPlatform',
    component: CountImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'countImport/:idPlatform/:idSurvey',
    component: CountImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'count/:idPlatform/:idSurvey',
    component: ViewCountPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
]
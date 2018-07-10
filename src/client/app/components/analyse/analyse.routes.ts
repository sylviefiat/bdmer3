import { AnalysePageComponent } from './analyse-page.component';
import { ResultPageComponent } from './result-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const AnalyseRoutes: Array<any> = [
  {
    path: 'analyse',
    component: AnalysePageComponent, 
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'result',
    component: ResultPageComponent, 
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
];

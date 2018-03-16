import { AnalysePageComponent } from './analyse-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const AnalyseRoutes: Array<any> = [
  {
    path: 'analyse',
    component: AnalysePageComponent, 
    canActivate : [AuthGuard]
  }
];

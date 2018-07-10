import { SurveyFormPageComponent } from './survey-form-page.component';
import { SurveyImportPageComponent } from './survey-import-page.component';
import { ViewSurveyPageComponent } from './view-survey-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const SurveyRoutes: Array<any> = [

  {
    path: 'surveyForm/:idPlatform',
    component: SurveyFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },{
    path: 'surveyForm/:idPlatform/:idSurvey',
    component: SurveyFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'surveyImport/:idPlatform',
    component: SurveyImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'survey/:idPlatform/:idSurvey',
    component: ViewSurveyPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
]
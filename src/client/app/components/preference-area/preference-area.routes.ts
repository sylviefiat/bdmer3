import { PreferenceAreaFormPageComponent } from './preference-area-form-page.component';
import { PreferenceAreaImportPageComponent } from './preference-area-import-page.component';
import { ViewPreferenceAreaPageComponent } from './view-preference-area-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const PreferenceAreaRoutes: Array<any> = [
  {
    path: 'zonePrefForm/:idPlatform/:idZone',
    component: PreferenceAreaFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },{
    path: 'zonePrefForm/:idPlatform/:idZone/:idZonePref',
    component: PreferenceAreaFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'zonePrefImport/:idPlatform',
    component: PreferenceAreaImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'zonePrefImport/:idPlatform/:idZone',
    component: PreferenceAreaImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'zonePref/:idPlatform/:idZone/:idZonePref',
    component: ViewPreferenceAreaPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
]
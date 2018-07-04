import { PlatformListPageComponent } from './platform-list-page.component';
import { PlatformFormPageComponent } from './platform-form-page.component';
import { PlatformImportPageComponent } from './platform-import-page.component';
import { ViewPlatformPageComponent } from './view-platform-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const PlatformRoutes: Array<any> = [
  {
    path: 'platform',
    component: PlatformListPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'platform/:id',
    component: ViewPlatformPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }, {
    path: 'platform/:id/:view',
    component: ViewPlatformPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }, {
    path: 'platformForm',
    component: PlatformFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'platformForm/:id',
    component: PlatformFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'platformImport',
    component: PlatformImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
]
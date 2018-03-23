import { PlatformListPageComponent } from './platform-list-page.component';
import { PlatformFormPageComponent } from './platform-form-page.component';
import { PlatformImportPageComponent } from './platform-import-page.component';
import { ViewPlatformPageComponent } from './view-platform-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const PlatformRoutes: Array<any> = [
  {
    path: 'platform',
    component: PlatformListPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'platform/:id',
    component: ViewPlatformPageComponent,
    canActivate : [AuthGuard]
  }, {
    path: 'platform/:id/:view',
    component: ViewPlatformPageComponent,
    canActivate : [AuthGuard]
  }, {
    path: 'platformForm',
    component: PlatformFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'platformForm/:id',
    component: PlatformFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'platformImport',
    component: PlatformImportPageComponent,
    canActivate : [AuthGuard]
  }
]
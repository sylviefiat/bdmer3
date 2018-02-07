import { SiteListPageComponent } from './site-list-page.component';
import { SiteFormPageComponent } from './site-form-page.component';
import { SiteImportPageComponent } from './site-import-page.component';
import { ViewSitePageComponent } from './view-site-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const SiteRoutes: Array<any> = [
  {
    path: 'site',
    component: SiteListPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'site/:id',
    component: ViewSitePageComponent,
    canActivate : [AuthGuard]
  }, {
    path: 'site/:id/:view',
    component: ViewSitePageComponent,
    canActivate : [AuthGuard]
  }, {
    path: 'siteForm',
    component: SiteFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'siteForm/:id',
    component: SiteFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'siteImport',
    component: SiteImportPageComponent,
    canActivate : [AuthGuard]
  }
]
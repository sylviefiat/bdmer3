
import { ManagementPageComponent } from './management-page.component';
import { SpeciesFormPageComponent } from './species/species-form-page.component';
import { SpeciesImportPageComponent } from './species/species-import-page.component';
import { ViewSpeciesPageComponent } from './species/view-species-page.component';
import { SiteFormPageComponent } from './site/site-form-page.component';
import { SiteImportPageComponent } from './site/site-import-page.component';
import { ViewSitePageComponent } from './site/view-site-page.component';
import { ZoneFormPageComponent } from './zone/zone-form-page.component';
import { ZoneImportPageComponent } from './zone/zone-import-page.component';
import { ViewZonePageComponent } from './zone/view-zone-page.component';
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
  {
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
  },
  {
    path: 'site/:id',
    component: ViewSitePageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneForm/:idsite',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneForm/:idsite/:idzone',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'soneImport',
    component: ZoneImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'sone/:idsite/:idzone',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard]
  },
];

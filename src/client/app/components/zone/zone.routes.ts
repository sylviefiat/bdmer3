import { ZoneFormPageComponent } from './zone-form-page.component';
import { ZoneImportPageComponent } from './zone-import-page.component';
import { ViewZonePageComponent } from './view-zone-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const ZoneRoutes: Array<any> = [
  /*{
    path: 'zone',
    component: ZoneListPageComponent,
    canActivate : [AuthGuard]
  }, */
  {
    path: 'zoneForm/:idPlatform/:idZone',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'zoneForm/:idPlatform',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'zoneImport/:idPlatform',
    component: ZoneImportPageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'zone/:idPlatform/:idZone',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'zone/:idPlatform/:idZone/:view',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
]
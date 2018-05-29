import { StationFormPageComponent } from './station-form-page.component';
import { StationImportPageComponent } from './station-import-page.component';
import { ViewStationPageComponent } from './view-station-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const StationRoutes: Array<any> = [
  /*{
    path: 'station',
    component: StationListPageComponent,
    canActivate : [AuthGuard]
  }, */
  {
    path: 'stationForm/:idPlatform',
    component: StationFormPageComponent,
    canActivate : [AuthGuard]
  },{
    path: 'stationForm/:idPlatform/:idStation',
    component: StationFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'stationImport/:idPlatform',
    component: StationImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'stationImport/:idPlatform',
    component: StationImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'station/:idPlatform/:idStation',
    component: ViewStationPageComponent,
    canActivate : [AuthGuard]
  }
]
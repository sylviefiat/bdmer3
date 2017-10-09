import { MapComponent } from './map.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const MapRoutes: Array<any> = [
  {
    path: 'map',
    component: MapComponent, 
    //canActivate : [AuthGuard]
  }
];
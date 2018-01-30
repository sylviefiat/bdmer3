import { CampaignFormPageComponent } from './campaign-form-page.component';
import { CampaignImportPageComponent } from './campaign-import-page.component';
import { ViewCampaignPageComponent } from './view-campaign-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const CampaignRoutes: Array<any> = [

  {
    path: 'campaignForm/:idSite/:idZone',
    component: CampaignFormPageComponent,
    canActivate : [AuthGuard]
  },{
    path: 'campaignForm/:idSite/:idZone/:idTransect',
    component: CampaignFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'campaignImport/:idSite',
    component: CampaignImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'campaignImport/:idSite/:idZone',
    component: CampaignImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'campaign/:idSite/:idZone/:idTransect',
    component: ViewCampaignPageComponent,
    canActivate : [AuthGuard]
  }
]
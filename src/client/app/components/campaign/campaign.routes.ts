import { CampaignFormPageComponent } from './campaign-form-page.component';
import { CampaignImportPageComponent } from './campaign-import-page.component';
import { ViewCampaignPageComponent } from './view-campaign-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const CampaignRoutes: Array<any> = [

  {
    path: 'campaignForm/:idSite',
    component: CampaignFormPageComponent,
    canActivate : [AuthGuard]
  },{
    path: 'campaignForm/:idSite/:idCampaign',
    component: CampaignFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'campaignImport/:idSite',
    component: CampaignImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'campaign/:idSite/:idCampaign',
    component: ViewCampaignPageComponent,
    canActivate : [AuthGuard]
  }
]
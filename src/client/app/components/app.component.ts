// any operators needed throughout your application
import './operators';

// libs
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

// app
import { IAppState} from '../modules/ngrx/index';
import { AuthAction } from '../modules/auth/actions/index';

import { AnalyticsService } from '../modules/analytics/services/index';
import { LogService, AppService } from '../modules/core/services/index';
import { Config } from '../modules/core/utils/index';


/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  constructor(
    public analytics: AnalyticsService,
    public log: LogService,
    private appService: AppService,
    private store: Store<IAppState>
  ) {
    log.debug(`Config env: ${Config.ENVIRONMENT().ENV}`);
  }



}

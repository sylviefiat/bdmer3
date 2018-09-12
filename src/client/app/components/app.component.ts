// any operators needed throughout your application
import './operators';

// libs
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// app
import { IAppState, getisLoggedIn} from '../modules/ngrx/index';
import { AuthAction } from '../modules/auth/actions/index';
import { Authenticate, AuthInfo } from '../modules/auth/models/user';

import { LogService } from '../modules/core/services/index';
import { AppService } from '../modules/core/services/index';
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
    public log: LogService,
    private appService: AppService,
    private store: Store<IAppState>
  ) {
    log.debug(`Config env: ${Config.ENVIRONMENT().ENV}`);
  }
}

// any operators needed throughout your application
import './operators';

// libs
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// app
import { IAppState, getisLoggedIn} from '../modules/ngrx/index';
import { AuthAction } from '../modules/auth/actions/index';
import { Authenticate, AuthInfo } from '../modules/auth/models/user';

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
  public isLoggedIn$: Observable<any>;
  
  constructor(
    public log: LogService,
    private appService: AppService,
    private store: Store<IAppState>
  ) {
    log.debug(`Config env: ${Config.ENVIRONMENT().ENV}`);

    let token:AuthInfo = JSON.parse(localStorage.getItem('token'));
    if(token && token.expires > Math.floor(Date.now() / 1000))
      this.store.dispatch(new AuthAction.LoginSuccess(token));
    else {
      this.store.dispatch(new AuthAction.Logout(token));
    }
    this.isLoggedIn$ = this.store.let(getisLoggedIn);
  }
}

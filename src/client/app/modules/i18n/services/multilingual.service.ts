// angular
import { Injectable, InjectionToken } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

// app
import { ILang } from '../../core/index';
import { WindowService } from '../../core/services/window.service';
import { IAppState, getLangues } from '../../ngrx/index';

// module
import { CATEGORY } from '../common/category.common';
import { IMultilingualState, initialState } from '../states/index';
import { MultilingualAction } from '../actions/index';

// provide supported languages at runtime
export const Languages: InjectionToken<Array<ILang>> = new InjectionToken('Languages');
// optional view helper for language handling
// {N} uses this to provide specific classes to SegmentedBar view bindings
export const LanguageViewHelper: InjectionToken<Array<any>> = new InjectionToken('LanguageViewHelper');
export const LanguageProviders = [
  { provide: Languages, useValue: [] },
  { provide: LanguageViewHelper, useValue: null }
];

// service
@Injectable()
export class MultilingualService {

  constructor(
    private translate: TranslateService,
    private win: WindowService,
    private store: Store<IAppState>
  ) {
  
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(initialState.lang);

    // use browser/platform lang if available
    let userLang = win.navigator.language.split('-')[0];

    store.select(getLangues).subscribe(lang => this.translate.use(lang));


    // init the lang
    this.store.dispatch(new MultilingualAction.ChangeAction(userLang));
  }
}

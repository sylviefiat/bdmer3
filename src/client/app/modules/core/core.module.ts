// angular
import { NgModule, ModuleWithProviders, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PapaParseModule } from 'ngx-papaparse';
import { MatDialogModule } from '@angular/material';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
// module
import { SharedModule } from '../shared/index';
import { CountriesModule } from '../countries/index';
import { DatasModule } from '../datas/index';
import { AuthModule } from '../auth/index';
import { AnalyseModule } from '../analyse/index';
import { CORE_DIRECTIVES } from './directives/index';
import { CORE_PROVIDERS } from './services/index';
import { Config } from './utils/index';

import { zoneMapModal } from '../../components/zone/zone-map-modal.component';
import { stationMapModal } from '../../components/station/station-map-modal.component';

interface ICoreModuleOptions {
    window?: any;
    console?: any;
}

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        SharedModule,
        CountriesModule,
        DatasModule,
        AuthModule,
        PapaParseModule,
        MatDialogModule,
        AnalyseModule,
        NgxMapboxGLModule.withConfig({
            accessToken: 'pk.eyJ1Ijoic3lsdmllZmlhdCIsImEiOiJjamk1MnZieGMwMTUxM3FxbDRhb2o5dDc3In0.V8jhcEcPBkyugxnw5gj2uw'
        }),
    ],
    declarations: [
        ...CORE_DIRECTIVES,
        zoneMapModal,
        stationMapModal
    ],
    exports: [
        ...CORE_DIRECTIVES
    ],
    providers: [
        ...CORE_PROVIDERS,
        SharedModule
    ],
    entryComponents: [zoneMapModal, stationMapModal]
})
export class CoreModule {
    // configuredProviders: *required to configure WindowService and ConsoleService per platform
    static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: configuredProviders
        };
    }
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule already loaded; Import in root module only.');
        }
    }
}
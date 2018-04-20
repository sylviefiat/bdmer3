import { join } from 'path';
import { SeedAdvancedConfig } from './seed-advanced.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedAdvancedConfig {

    PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

    constructor() {
        super();
        this.APP_TITLE = 'BDMER³';
        // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

        /* Enable typeless compiler runs (faster) between typed compiler runs. */
        // this.TYPED_COMPILE_INTERVAL = 5;

        // Add `NPM` third-party libraries to be injected/bundled.
        this.NPM_DEPENDENCIES = [
            ...this.NPM_DEPENDENCIES
        ];

        // Add `local` third-party libraries to be injected/bundled.
        this.APP_ASSETS = [
            // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
            // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
        ];

        this.ROLLUP_INCLUDE_DIR = [
            ...this.ROLLUP_INCLUDE_DIR,
            //'node_modules/moment/**'
        ];

        this.ROLLUP_NAMED_EXPORTS = [
            ...this.ROLLUP_NAMED_EXPORTS,
            //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
        ];

        // Add packages (e.g. ng2-translate)
        // ng2-translate is already added with the advanced seed - here for example only
        let additionalPackages: ExtendPackages[] = [{
            name: 'angular2-fontawesome',
            path: 'node_modules/angular2-fontawesome/angular2-fontawesome.js'
        },{
            name: '@mapbox/togeojson',
            path: 'node_modules/@mapbox/togeojson/togeojson.js'
        },{
            name: 'xmldom',
            path: 'node_modules/xmldom/dom.js'
        },{
            name: '@mapbox/geojson-area',
            path: 'node_modules/@mapbox/geojson-area/index.js'
        },{
            name: 'wgs84',
            path: 'node_modules/wgs84/index.js'
        },{
            name: 'moment',
            path: 'node_modules/moment/moment.js'
        }, {
            name: 'angular2-moment',
            path: 'node_modules/angular2-moment/index.js'
        }, {
            name: 'jquery',
            path: 'node_modules/jquery/dist/jquery.min.js'
        }, {
            name: 'jquery-confirm',
            path: 'node_modules/jquery-confirm/dist/jquery-confirm.min.js'
        }, {
            name: '@agm/core',
            packageMeta: {
                main: 'core.umd.js',
                defaultExtension: 'js'
            }
        }, {
            name: 'pouchdb',
            path: 'node_modules/pouchdb/dist/pouchdb.js'
            //path: 'node_modules/pouchdb/lib/index.js'
        }/*, {
            name: 'pouchdb-auth',
            path: 'node_modules/pouchdb-auth/lib/index.js'
            //path: 'node_modules/pouchdb/lib/index.js'
        }, {
            name: 'pouchdb-seamless-auth',
            path: 'node_modules/pouchdb-seamless-auth/lib/index.js'
            //path: 'node_modules/pouchdb/lib/index.js'
        }*/, {
            name: 'pouchdb-authentication',
            path: 'node_modules/pouchdb-authentication/dist/pouchdb.authentication.min.js'
        }/*, {
            name: 'pouchdb-utils',
            path: 'node_modules/pouchdb-utils/lib/index.js'
        }, {
            name: 'pouchdb-ajax',
            path: 'node_modules/pouchdb-ajax/lib/index.js'
        }, {
            name: 'pouchdb-collection',
            path: 'node_modules/pouchdb-collection/lib/index.js'
        }, {
            name: 'pouchdb-binary-utils',
            path: 'node_modules/pouchdb-binary-utils/lib/index.js'
        }, {
            name: 'pouchdb-promise',
            path: 'node_modules/pouchdb-promise/lib/index.js'
        }, {
            name: 'pouchdb-collections',
            path: 'node_modules/pouchdb-collections/lib/index.js'
        }, {
            name: 'pouchdb-errors',
            path: 'node_modules/pouchdb-errors/lib/index.js'
        }, {
            name: 'crypto',
            path: 'node_modules/pouchdb/node_modules/hawk/lib/crypto.js'
        }, {
            name: 'utils',
            path: 'node_modules/pouchdb/node_modules/hawk/lib/utils.js'
        }, {
            name: 'request',
            path: 'node_modules/request/index.js'
        }, {
            name: 'boom',
            path: 'node_modules/boom/lib/index.js'
        }, {
            name: 'sntp',
            path: 'node_modules/sntp/index.js'
        }, {
            name: 'is-array-buffer-x',
            path: 'node_modules/is-array-buffer-x/lib/is-array-buffer-x.js'
        }, {
            name: 'lie',
            path: 'node_modules/lie/dist/lie.js'
        }, {
            name: 'uuid',
            path: 'node_modules/uuid/index.js'
        }, {
            name: 'url-join',
            path: 'node_modules/url-join/lib/url-join.js'
        }, {
            name: 'url-parse',
            path: 'node_modules/url-parse/dist/url-parse.js'
        }, {
            name: 'inherits',
            path: 'node_modules/inherits/inherits.js'
        }, {
            name: 'buffer-from',
            path: 'node_modules/buffer-from/index.js'
        }, {
            name: 'clone-buffer',
            path: 'node_modules/clone-buffer/index.js'
        }, {
            name: 'argsarray',
            path: 'node_modules/argsarray/index.js'
        }, {
            name: 'traceur',
            path: 'node_modules/traceur/bin/traceur.js'
        }*/, {
            name: '@angular/material',
            packageMeta: {
                main: 'bundles/material.umd.js',
                defaultExtension: 'js'
            }
        }, {
            name: '@angular/animations',
            packageMeta: {
                main: 'bundles/animations.umd.js',
                defaultExtension: 'js'
            }
        }, {
            name: '@angular/cdk',
            packageMeta: {
                main: 'bundles/cdk.umd.js',
                defaultExtension: 'js'
            }
        },
        {
            name: '@angular/cdk/a11y',
            path: 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js'
        }, {
            name: '@angular/cdk/bidi',
            path: 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js'
        }, {
            name: '@angular/cdk/coercion',
            path: 'node_modules/@angular/cdk/bundles/cdk-coercion.umd.js'
        },
        {
            name: '@angular/cdk/collections',
            path: 'node_modules/@angular/cdk/bundles/cdk-collections.umd.js'
        },
        {
            name: '@angular/cdk/keycodes',
            path: 'node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js'
        },
        {
            name: '@angular/cdk/observers',
            path: 'node_modules/@angular/cdk/bundles/cdk-observers.umd.js'
        },
        {
            name: '@angular/cdk/overlay',
            path: 'node_modules/@angular/cdk/bundles/cdk-overlay.umd.js'
        },
        {
            name: '@angular/cdk/platform',
            path: 'node_modules/@angular/cdk/bundles/cdk-platform.umd.js'
        },
        {
            name: '@angular/cdk/portal',
            path: 'node_modules/@angular/cdk/bundles/cdk-portal.umd.js'
        },
        {
            name: '@angular/cdk/rxjs',
            path: 'node_modules/@angular/cdk/bundles/cdk-rxjs.umd.js'
        },
        {
            name: '@angular/cdk/scrolling',
            path: 'node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js'
        },
        {
            name: '@angular/cdk/stepper',
            path: 'node_modules/@angular/cdk/bundles/cdk-stepper.umd.js'
        },
        {
            name: '@angular/cdk/table',
            path: 'node_modules/@angular/cdk/bundles/cdk-table.umd.js'
        }, {
            name: '@ngrx/db',
            packageMeta: {
                main: 'bundles/db.umd.js',
                defaultExtension: 'js'
            }
        }, {
            name: 'ngx-papaparse',
            packageMeta: {
                main: 'bundles/ngx-papaparse.umd.js',
                defaultExtension: 'js'
            }
        }];

        this.addPackagesBundles(additionalPackages);

        /* Add proxy middleware */
        // this.PROXY_MIDDLEWARE = [
        //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
        // ];

        /* Add to or override NPM module configurations: */
        // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
    }

}

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
        //this.GOOGLE_ANALYTICS_ID = 'Your site's ID';
        /* Enable typeless compiler runs (faster) between typed compiler runs. */
        // this.TYPED_COMPILE_INTERVAL = 5;
        // Add `NPM` third-party libraries to be injected/bundled.
        this.NPM_DEPENDENCIES = [...this.NPM_DEPENDENCIES];

        // Add `local` third-party libraries to be injected/bundled.
        this.APP_ASSETS = [
            // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
            // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
        ];

        this.ROLLUP_INCLUDE_DIR = [
            ...this.ROLLUP_INCLUDE_DIR
            //'node_modules/moment/**'
        ];

        this.ROLLUP_NAMED_EXPORTS = [
            ...this.ROLLUP_NAMED_EXPORTS
            //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
        ];

        // Add `local` third-party libraries to be injected/bundled.
        this.APP_ASSETS = [
            // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
            // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
        ];

        this.ROLLUP_INCLUDE_DIR = [
            ...this.ROLLUP_INCLUDE_DIR,
            'node_modules/moment/**'
        ];

        this.ROLLUP_NAMED_EXPORTS = [
            ...this.ROLLUP_NAMED_EXPORTS,
            //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
        ];

        // Add packages (e.g. ng2-translate)
        // ng2-translate is already added with the advanced seed - here for example only
        let additionalPackages: ExtendPackages[] = [
        /*{
            name: 'angular2-fontawesome',
            path: 'node_modules/angular2-fontawesome/angular2-fontawesome.js'
        }, {
            name: 'wgs84',
            path: 'node_modules/wgs84/index.js'
        }, {
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
        }, ,
        {
            name: 'traceur',
            path: 'node_modules/traceur/bin/traceur.js'
        },
        {
            name: 'supercluster',
            path: 'node_modules/supercluster/dist/supercluster.min.js'
        },
        {
            name: '@turf/bbox',
            path: 'node_modules/ngx-mapbox-gl/node_modules/@turf/bbox/index.js'
        },
        {
            name: 'mapbox-gl',
            path: 'node_modules/mapbox-gl/dist/mapbox-gl-dev.js'
        },
        {
            name: 'through',
            path: 'node_modules/through/index.js'
        },
        {
            name: 'jsonparse',
            path: 'node_modules/jsonparse/jsonparse.js'
        },
        {
            name: 'fs',
            path: 'node_modules/graceful-fs/fs.js'
        },
        {
            name: 'highcharts/modules/indicators',
            path: 'node_modules/highcharts/modules/indicators.js'
        },
        {
            name: 'highcharts/modules/exporting',
            path: 'node_modules/highcharts/modules/exporting.js'
        },
        {
            name: 'highcharts/modules/export-data',
            path: 'node_modules/highcharts/modules/export-data.js'
        },
        {
            name: 'highcharts/highcharts-more',
            path: 'node_modules/highcharts/highcharts-more.js'
        },
        {
            name: 'highcharts/highstock',
            path: 'node_modules/highcharts/highstock.js'
        },
        {
            name: 'highcharts/highmaps',
            path: 'node_modules/highcharts/highmaps.js'
        },
        {
            name: 'highcharts',
            path: 'node_modules/highcharts/highcharts.js'
        }, {
            name: 'pouchdb',
            path: 'node_modules/pouchdb/dist/pouchdb.js'
        }, {
            name: 'pouchdb-authentication',
            path: 'node_modules/pouchdb-authentication/dist/pouchdb.authentication.js'
        }, {
            name: '@angular/material',
            path: 'node_modules/@angular/material/bundles/material.umd.js'
        }, {
            name: '@angular/cdk',
            path: 'node_modules/@angular/cdk/index.js'
        },
        {
            name: '@angular/cdk/a11y',
            path: 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js'
        }, {
            name: '@angular/cdk/bidi',
            path: 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js'
        }, {
            name: '@angular/cdk/layout',
            path: 'node_modules/@angular/cdk/bundles/cdk-layout.umd.js'
        }, {
            name: '@angular/cdk/accordion',
            path: 'node_modules/@angular/cdk/bundles/cdk-accordion.umd.js'
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
        },
        {
            name: '@angular/cdk/text-field',
            path: 'node_modules/@angular/cdk/bundles/cdk-text-field.umd.js'
        },
        {
            name: '@angular/cdk/tree',
            path: 'node_modules/@angular/cdk/bundles/cdk-tree.umd.js'
        },
        {
            name: 'angular-ts-math',
            path: 'node_modules/angular-ts-math/dist/angular-ts-math.js'
        },
        {
            name: 'angular-material-icons',
            path: 'node_modules/angular-material-icons/angular-material-icons.js'
        },
        {
            name: 'papaparse',
            path: 'node_modules/papaparse'
        }, {
            name: 'ngx-papaparse',
            path: 'node_modules/ngx-papaparse/bundles/ngx-papaparse.umd.min.js'
        },
        {
            name: '@turf/turf',
            path: 'node_modules/@turf/turf/turf.js'
        },
        {
            name: '@turf/helpers',
            path: 'node_modules/@turf/helpers/index.js'
        },
        {
            name: '@turf/meta',
            path: 'node_modules/@turf/meta/index.js'
        },
        {
            name: '@turf/combine',
            path: 'node_modules/@turf/combine/index.js'
        },
        {
            name: '@turf/boolean-point-in-polygon',
            path: 'node_modules/@turf/boolean-point-in-polygon/index.js'
        },
        {
            name: '@turf/invariant',
            path: 'node_modules/@turf/invariant/index.js'
        },
        {
            name: '@turf/intersect',
            path: 'node_modules/@turf/intersect/index.js'
        },
        {
            name: 'martinez-polygon-clipping',
            path: 'node_modules/martinez-polygon-clipping/dist/martinez.min.js'
        },
        {
            name: 'html2canvas',
            path: 'node_modules/html2canvas/dist/html2canvas.min.js'
        },
        {
            name: '@mapbox/togeojson',
            path: 'node_modules/@mapbox/togeojson/togeojson.js'
        },
        {
            name: '@mapbox/geojson-area',
            path: 'node_modules/@mapbox/geojson-area/index.js'
        },
        {
            name: '@mapbox/mapbox-gl-geocoder',
            path: 'node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
        }*/];

        this.addPackagesBundles(additionalPackages);

        // Fix up path to bootstrap module
        //this.SYSTEM_CONFIG.paths[this.BOOTSTRAP_MODULE].defaultExtension = 'js';
        /* Add proxy middleware */
        // this.PROXY_MIDDLEWARE = [
        //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
        // ];

        /* Add to or override NPM module configurations: */
        //this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
    }
}

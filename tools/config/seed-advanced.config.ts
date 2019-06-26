import { argv } from 'yargs';
import { SeedConfig } from './seed.config';
import * as path from 'path';
import { ExtendPackages } from './seed.config.interfaces';

export class SeedAdvancedConfig extends SeedConfig {
  /**
   * The base folder of the nativescript applications source files.
   * @type {string}
   */
  TNS_BASE_DIR = 'nativescript';

  srcSubdir = 'src';
  destSubdir = 'app';

  TNS_APP_SRC = `${this.TNS_BASE_DIR}/${this.srcSubdir}`;

  TNS_APP_DEST = `${this.TNS_BASE_DIR}/${this.destSubdir}`;

  TNS_CONFIG = {
    ANALYTICS_TRACKING_ID: '',
  };

  /**
  * Holds added packages for desktop build.
  */
  DESKTOP_PACKAGES: ExtendPackages[] = [];

  constructor() {
    super();

    this.ENABLE_SCSS = true;

    if (argv && argv._) {
      if (argv['desktop']) {
        this.TARGET_DESKTOP = true;
        if (argv['desktopBuild']) {
          this.TARGET_DESKTOP_BUILD = true;
        }
      } else if (argv['hybrid']) {
        this.TARGET_MOBILE_HYBRID = true;
      }
    }
    let bootstrap = 'main.web';
    if (this.TARGET_MOBILE_HYBRID) {
      // Perhaps Ionic or Cordova
      // This is not implemented in the seed but here to show you way forward if you wanted to add
      bootstrap = 'main.mobile.hybrid';
    }
    // Override seed defaults
    this.BOOTSTRAP_DIR = argv['app'] ? (argv['app'] + '/') : '';
    this.BOOTSTRAP_MODULE = `${this.BOOTSTRAP_DIR}${bootstrap}`;
    this.NG_FACTORY_FILE = `${bootstrap}.prod`;
    this.BOOTSTRAP_PROD_MODULE = `${this.BOOTSTRAP_DIR}${bootstrap}`;
    this.BOOTSTRAP_FACTORY_PROD_MODULE = `${this.BOOTSTRAP_DIR}${bootstrap}.prod`;

    this.APP_TITLE = 'Angular Seed Advanced';
    this.APP_BASE = this.TARGET_DESKTOP ? '' // paths must remain relative for desktop build
      : '/';

    // Advanced seed packages
    let additionalPackages: ExtendPackages[] = [
      {
        name: 'plugin-babel',
        path: 'node_modules/systemjs-plugin-babel/plugin-babel.js'
      },
      {
        name: 'systemjs-babel-build',
        path: 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'
      },
      {
        name: '@angular/common/http',
        path: 'node_modules/@angular/common/bundles/common-http.umd.js'
      }, {
        name: '@angular/common/locales/fr',
        path: 'node_modules/@angular/common/locales/fr.js'
      }, {
        name: 'lodash',
        path: 'node_modules/lodash/lodash.js'
      },
      {
        name: 'xmldom',
        path: 'node_modules/xmldom/dom.js'
      },
      {
        name: '@ngrx/store',
        packageMeta: {
          main: 'bundles/store.umd.js',//'node_modules/@ngrx/store/bundles/store.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/effects',
        packageMeta: {
          main: 'bundles/effects.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/effects/testing',
        path: 'index.js'
      },
      {
        name: '@ngrx/store-devtools',
        packageMeta: {
          main: 'bundles/store-devtools.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngx-translate/core',
        path: 'node_modules/@ngx-translate/core/bundles/ngx-translate-core.umd.js'
      },
      {
        name: '@ngx-translate/http-loader',
        path: 'node_modules/@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd.js'
      },
      {
        name: 'ngrx-store-freeze',
        path: 'node_modules/ngrx-store-freeze/dist/index.js'
      },
      {
        name: 'deep-freeze-strict',
        path: 'node_modules/deep-freeze-strict/index.js'
      },
      {
        name: 'rxjs',
        packageMeta: {
          defaultExtension: 'js',
          main: 'bundles/rxjs.umd.js',
          map: {
            './observable': './observable/index.js',
            './operators': './operators/index.js'
          }
        }
      },
      {
        name: 'rxjs-compat',
        packageMeta: {
          defaultExtension: 'js',
          main: 'bundles/rxjs.umd.js',
          map: {
            './observable': './observable/index.js',
            './operators': './operators/index.js'
          }
        }
      },
      {
        name: 'tslib',
        path: 'node_modules/tslib/tslib.js'
      },
      {
        name: 'ngx-mapbox-gl',
        packageMeta: {
          defaultExtension: 'js',
          main: 'bundles/ngx-mapbox-gl.umd.js',
          format: 'cjs'
        }
      },
      {
        name: 'file-saver',
        packageMeta: {
          defaultExtension: 'js',
          main: 'dist/FileSaver.js',
          format: 'global'
        }
      },
      {
        name: '@mapbox/mapbox-sdk',
        packageMeta: {
          defaultExtension: 'js',
          main: 'umd/mapbox-sdk.js'
        }
      },
      {
        name: 'jspdf',
        packageMeta: {
          format: 'global'
        },
        path: 'dist/jspdf.min.js',
      },
      {
        name: 'angular2-fontawesome',
        path: 'node_modules/angular2-fontawesome/angular2-fontawesome.js'
      }, 
      {
        name: 'wgs84',
        path: 'node_modules/wgs84/index.js'
      },
      {
        name: 'moment',
        path: 'node_modules/moment/moment.js'
      },
      {
        name: 'angular2-moment',
        path: 'node_modules/angular2-moment/index.js'
      }, 
      {
        name: 'jquery',
        path: 'node_modules/jquery/dist/jquery.min.js'
      },
      {
        name: 'jquery-confirm',
        path: 'node_modules/jquery-confirm/dist/jquery-confirm.min.js'
      },
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
        },
        {
            name: 'xlsx',
            path: 'node_modules/xlsx/dist/xlsx.full.min.js'
        }
    ];

    /**
     * Need to duplicate this in the project.config.ts to
     * pick up packages there too.
     */
    this.DESKTOP_PACKAGES = [
      ...this.DESKTOP_PACKAGES,
      ...additionalPackages,
    ];

    this.addPackagesBundles(additionalPackages);

    // Settings for building sass (include ./srs/client/scss in includes)
    // Needed because for components you cannot use ../../../ syntax
    this.PLUGIN_CONFIGS['gulp-sass'] = {
      includePaths: [
        './src/client/scss/',
        './node_modules/',
        './'
      ]
    };

    // Settings for building sass for tns modules
    this.PLUGIN_CONFIGS['gulp-sass-tns'] = {
      includePaths: [
        this.srcSubdir,
        './node_modules/',
        './node_modules/nativescript-theme-core/scss/'
      ].map((dir) => path.resolve(this.TNS_BASE_DIR, dir)),
    };

    // Fix up path to bootstrap module
    //this.SYSTEM_CONFIG.paths[this.BOOTSTRAP_MODULE] = `${this.APP_BASE}${this.BOOTSTRAP_MODULE}`;

    /** Production **/

    //delete this.SYSTEM_BUILDER_CONFIG['packageConfigPaths']; // not all libs are distributed the same
  }
}

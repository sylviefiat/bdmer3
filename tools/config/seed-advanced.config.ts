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
     /* {
        name: 'xlsx',   
        path: 'node_modules/xlsx/dist/xlsx.full.min.js',
      },*/
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

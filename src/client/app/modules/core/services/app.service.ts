import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../config';

// app
import { LogService } from './logging/log.service';
import { Config } from '../utils/config';

@Injectable()
export class AppService {
    private appConfig;
    private prefixDb;

    constructor(public log: LogService, private injector: Injector) {
        this.log.debug(`AppService -> Config env: ${Config.ENVIRONMENT().ENV}`);
    }

    /*loadAppConfig(): Promise<any> {
        let http = this.injector.get(HttpClient);

        return http.get('assets/app-config.json')
            .toPromise()
            .then(data => {
                console.log(data);
                this.appConfig = data;
                console.log(this.appConfig);
            })
            .catch(error => {
                console.warn("Error loading app-config.json, using envrionment file instead");
                this.appConfig = environment;
            })
    }*/

    get config() {
        return this.appConfig;
    }
}

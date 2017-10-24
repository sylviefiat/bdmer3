import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Species, NameI18N, CoefsAB, Conversion, BiologicDimensions, LegalDimensions } from '../../datas/models/species';

@Injectable()
export class Csv2JsonService {

    constructor(private papa: PapaParseService) {

    }

    private extractSpeciesData(data): Species[] { // Input csv data to the function
        let allTextLines = data;
        let headers = allTextLines[0];
        let lines: Species[] = [];
        // don't iclude header start from 1
        for (let i = 1; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let sp = {} as Species;
                let header, name = {} as NameI18N, value, parts, legaldim = {} as LegalDimensions;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "code":
                        case "distribution":
                        case "scientific_name":
                        case "habitat_preference":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            sp[header] = data[j];
                            break;
                        case "sp_name":
                        case "sp_nom":
                            name = { lang: (headers[j].indexOf('name') != -1) ? "EN" : "FR", name: data[j] };
                            if (sp.names == null) sp.names = [];
                            sp.names.push(name);
                            break;
                        case "LLW_coef_a":
                        case "LLW_coef_b":
                        case "LW_coef_a":
                        case "LW_coef_b":
                            parts = headers[j].split('_');
                            header = parts[0];
                            value = parts[1] + parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
                            if (sp[header] == null) sp[header] = {} as CoefsAB;
                            sp[header][value] = data[j];
                            break;
                        case "conversion_salt":
                        case "conversion_BDM":
                            parts = headers[j].split('_');
                            header = parts[0] + 's';
                            value = parts[1];
                            if (sp[header] == null) sp[header] = {} as Conversion;
                            sp[header][value] = data[j];
                            break;
                        case "long_max":
                        case "larg_max":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            if (sp.biologicDimensions == null) sp.biologicDimensions = {} as BiologicDimensions;
                            sp.biologicDimensions[header] = data[j];
                            break;
                        case "L_min_NC":
                        case "L_min_VT":
                        case "L_min_PG":
                        case "L_min_SB":
                        case "L_min_FJ":
                        case "L_min_TO":
                            header = headers[j].substring(headers[j].lastIndexOf('_') + 1);
                            legaldim = { codeCountry: header, longMin: data[j], longMax: data[headers.indexOf('L_max_' + header)] };
                            if (sp.legalDimensions == null) sp.legalDimensions = [];
                            sp.legalDimensions.push(legaldim);
                            break;
                        default:
                            // do nothing...
                            break;
                    }
                }
                lines.push(sp);
            }
        }
        console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    csv2Species(csvFile: any): Observable<any> {
        return Observable.create(
            observable => {
                this.papa.parse(csvFile, {
                    download: true,
                    complete: function(results) {
                        console.log(results.data)
                        observable.next(results.data);
                        observable.complete();
                    }
                });
            })
            .mergeMap(data => {
                console.log(data);
                let res = this.extractSpeciesData(data);
                console.log(res);
                return res;
            });

    }
}
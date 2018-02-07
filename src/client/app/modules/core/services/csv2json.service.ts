import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MomentService } from './moment.service';
import { Species, NameI18N, CoefsAB, Conversion, BiologicDimensions, LegalDimensions } from '../../datas/models/species';
import { Site, Zone, Transect, Campaign, ZonePreference, Count, Mesure } from '../../datas/models/site';

@Injectable()
export class Csv2JsonService {
    static COMMA = ',';
    static SEMICOLON = ';';

    constructor(private papa: PapaParseService, private ms: MomentService) {
    }

    private extractSpeciesData(arrayData): Species[] { // Input csv data to the function
        let allTextLines = arrayData.data;
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
                        case "L_min_SO":
                            header = headers[j].substring(headers[j].lastIndexOf('_') + 1);
                            legaldim = { codeCountry: header, longMin: data[j], longMax: data[headers.indexOf('L_max_' + header)] };
                            if (sp.legalDimensions == null) sp.legalDimensions = [];
                            sp.legalDimensions.push(legaldim);
                            break;
                        case "L_max_NC":
                        case "L_max_VT":
                        case "L_max_PG":
                        case "L_max_SB":
                        case "L_max_FJ":
                        case "L_max_TO":
                        case "L_max_SO":
                            break;
                        default:
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(sp);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractSiteData(arrayData): Site[] { 
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: Site[] = [];
        for (let i = 1; i < allTextLines.length; i++) {
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Site;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "code":
                        case "description":
                        case "codeCountry":
                            st[headers[j]] = data[j];
                            break;
                        default:
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(st);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractZoneData(arrayData): Zone[] { 
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: Zone[] = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Zone;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "code":
                        case "codeSite":
                        case "surface":
                            st[headers[j]] = data[j];
                            break;
                        default:                            
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(st);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractCampaignData(arrayData): Campaign[] { 
        let allTextLines = arrayData.data;
        let delimiter = arrayData.meta.delimiter;
        let headers = allTextLines[0];
        let lines: Campaign[] = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Campaign;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codeCountry":
                        case "codeSite":
                        case "codeZone":
                        case "code":
                        case "participants":
                        case "surfaceTransect":
                        case "description":
                            st[headers[j]] = data[j];
                            break;
                        case "dateStart":
                        case "dateEnd":
                            let d;
                            // if it is french format reverse date and month in import date (from dd/MM/yyyy to MM/dd/yyyy)
                            if(delimiter === Csv2JsonService.SEMICOLON){
                                //this.ms.moment().locale("fr");
                                d = this.ms.moment(data[j], "DD/MM/YYYY").toISOString();
                            } else {
                                //this.ms.moment().locale("en");
                                d = this.ms.moment(data[j], "MM/DD/YYYY").toISOString();
                            }                         
                            st[headers[j]] = d;
                            break;
                        default:                            
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(st);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractTransectData(arrayData): Transect[] { 
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: Transect[] = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Transect;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codeSite":
                        case "codeZone":
                        case "code":
                        case "nom":
                        case "latitude":
                        case "longitude":
                        case "description":
                            st[headers[j]] = data[j];
                            break;
                        default:                            
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(st);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractZonePrefData(arrayData): ZonePreference[] { 
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: ZonePreference[] = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as ZonePreference;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codeSite":
                        case "codeZone":
                        case "code":
                        case "codeSpecies":
                        case "presence":
                        case "infoSource":
                            st[headers[j]] = data[j];
                            break;
                        default:                            
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(st);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractCountData(arrayData): Count[] { 
        let allTextLines = arrayData.data;
        let delimiter = arrayData.meta.delimiter;
        let headers = allTextLines[0];
        let lines: Count[] = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let ct = {} as Count;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codeSite":
                        case "codeZone":
                        case "codeCampaign":
                        case "code":
                        case "codeTransect":
                            ct[headers[j]] = data[j];
                            break;
                        case "date":
                            let d;
                            // if it is french format reverse date and month in import date (from dd/MM/yyyy to MM/dd/yyyy)
                            if(delimiter === Csv2JsonService.SEMICOLON){
                                //this.ms.moment().locale("fr");
                                d = this.ms.moment(data[j], "DD/MM/YYYY").toISOString();
                            } else {
                                //this.ms.moment().locale("en");
                                d = this.ms.moment(data[j], "MM/DD/YYYY").toISOString();
                            }                         
                            ct[headers[j]] = d;
                            break;
                        case "mesures":
                            let sp = data[headers.indexOf('codeSpecies')];
                            if (ct.mesures == null) ct.mesures = [];
                            let mes = data[j].split(',');
                            console.log(mes);
                            for(let dims in mes){
                                let longlarg = dims.split('/');
                                console.log(longlarg);
                                ct.mesures.push({codeSpecies: sp, long: longlarg[0], larg: (longlarg.length>0)?longlarg[1]:'0'});
                            }
                            break;
                        case "codeSpecies":
                            ct['monospecies'] = true;
                            break;
                        default:                            
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(ct);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    csv2(type: string, csvFile: any): Observable<any> {
        console.log(type);
        console.log(csvFile);
        return Observable.create(
            observable => {
                this.papa.parse(csvFile, {
                    /*delimiter: function(csvFile){
                        return ",";
                    },*/
                    skipEmptyLines: true,
                    download: true,
                    complete: function(results) {
                        console.log(results);
                        this.delimiter = results.meta.delimiter;
                        console.log(this.delimiter);
                        observable.next(results);
                        observable.complete();
                    }
                });
            })
            .mergeMap(data => {
                console.log(data);
                let res;
                switch (type) {
                    case "species":
                        res = this.extractSpeciesData(data);
                        break;
                    case "site":
                        res = this.extractSiteData(data);
                        break;
                    case "zone":
                        res = this.extractZoneData(data);
                        break;
                    case "campaign":
                        console.log(data);
                        res = this.extractCampaignData(data);
                        break;
                    case "zonePref":
                        console.log(data);
                        res = this.extractZonePrefData(data);
                        break;
                    case "transect":
                        console.log(data);
                        res = this.extractTransectData(data);
                        break;
                    case "count":
                        console.log(data);
                        res = this.extractCountData(data);
                        break;
                    default:
                        // code...
                        break;
                }
                console.log(res);
                return res;
            });

    }

    /*convertDate(dateStr: string): Date {
        const [day, month, year] = dateStr.split("-");
        return new Date(year, month - 1, day);
    }*/
}
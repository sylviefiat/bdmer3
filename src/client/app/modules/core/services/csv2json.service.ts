import { Injectable } from "@angular/core";
import { Papa } from "ngx-papaparse";
import { Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import { mergeMap } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

import { MomentService } from "./moment.service";
import { MapStaticService } from "./map-static.service";
import { Species, NameI18N, CoefsAB, Conversion, Dimensions, LegalDimensions } from "../../datas/models/species";
import { Platform, Zone, Station, Survey, ZonePreference, Count, Mesure } from "../../datas/models/platform";
import { PlatformAction } from "../../datas/actions/index";
import { IAppState } from "../../ngrx/index";

@Injectable()
export class Csv2JsonService {
  static COMMA = ",";
  static SEMICOLON = ";";
  csvErrorMsg: string;

  constructor(
    private store: Store<IAppState>,
    private translate: TranslateService,
    private mapStaticService: MapStaticService,
    private papa: Papa,
    private ms: MomentService
  ) {
    this.csvErrorMsg = this.translate.instant("CSV_FIELD_ERROR");
  }

  private extractSpeciesData(arrayData): Species[] | any[] {
    // Input csv data to the function
    let allTextLines = arrayData.data;
    let headers = allTextLines[0];
    let lines: Species[] = [];
    let errorTab = [];
    // don't iclude header start from 1
    for (let i = 1; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i];
      if (data.length == headers.length) {
        let sp = {} as Species;
        let header,
          name = {} as NameI18N,
          value,
          parts,
          legaldim = {} as LegalDimensions;
        for (let j = 0; j < headers.length; j++) {
          switch (headers[j]) {
            case "code":
            case "distribution":
            case "scientific_name":
            case "habitat_preference":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              sp[header] = data[j];
              break;
            case "sp_name":
            case "sp_nom":
              name = { lang: headers[j].indexOf("name") != -1 ? "EN" : "FR", name: data[j] };
              if (sp.names == null) sp.names = [];
              sp.names.push(name);
              break;
            case "LLW_coef_a":
            case "LLW_coef_b":
            case "LW_coef_a":
            case "LW_coef_b":
              parts = headers[j].split("_");
              header = parts[0];
              value = parts[1] + parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
              if (sp[header] == null) sp[header] = {} as CoefsAB;
              sp[header][value] = data[j];
              break;
            case "conversion_salt":
            case "conversion_BDM":
              parts = headers[j].split("_");
              header = parts[0] + "s";
              value = parts[1];
              if (sp[header] == null) sp[header] = {} as Conversion;
              sp[header][value] = data[j];
              break;
            case "long_max":
            case "larg_max":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              if (sp.biologicDimensions == null) sp.biologicDimensions = {} as Dimensions;
              sp.biologicDimensions[header] = data[j];
              break;
            case "L_min_NC":
            case "L_min_VU":
            case "L_min_PG":
            case "L_min_SB":
            case "L_min_FJ":
            case "L_min_TO":
            case "L_min_SO":
              header = headers[j].substring(headers[j].lastIndexOf("_") + 1);
              legaldim = { codeCountry: header, longMin: data[j], longMax: data[headers.indexOf("L_max_" + header)] };
              if (sp.legalDimensions == null) sp.legalDimensions = [];
              sp.legalDimensions.push(legaldim);
              break;
            case "L_max_NC":
            case "L_max_VU":
            case "L_max_PG":
            case "L_max_SB":
            case "L_max_FJ":
            case "L_max_TO":
            case "L_max_SO":
              break;
            default:
              if (!errorTab.includes(headers[j])) {
                errorTab.push(headers[j]);
              }
              break;
          }
        }
        lines.push(sp);
      }
    }
    if (errorTab.length !== 0) {
      let string = "";
      for (let i in errorTab) {
        if (parseInt(i) === errorTab.length - 1) {
          string += errorTab[i] + ".";
        } else {
          string += errorTab[i] + ", ";
        }
      }
      return [{ error: string }];
    }
    //console.log(lines); //The data in the form of 2 dimensional array.
    return lines;
  }

  extractPlatformData(arrayData): Platform[] | any[] {
    let allTextLines = arrayData.data;
    let headers = allTextLines[0];
    let lines: Platform[] = [];
    let errorTab = [];
    for (let i = 1; i < allTextLines.length; i++) {
      let data = allTextLines[i];
      if (data.length == headers.length) {
        let st = {} as Platform;
        let header;
        for (let j = 0; j < headers.length; j++) {
          switch (headers[j]) {
            case "code":
            case "description":
            case "codeCountry":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              st[headers[j]] = data[j];
              break;
            default:
              if (!errorTab.includes(headers[j])) {
                errorTab.push(headers[j]);
              }
              break;
          }
        }
        lines.push(st);
      }
    }

    if (errorTab.length !== 0) {
      let string = "";
      for (let i in errorTab) {
        if (parseInt(i) === errorTab.length - 1) {
          string += errorTab[i] + ".";
        } else {
          string += errorTab[i] + ", ";
        }
      }
      return [{ error: string }];
    }

    //console.log(lines); //The data in the form of 2 dimensional array.
    return lines;
  }

  extractZoneData(arrayData): Zone[] | any[] {
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
            case "code_platform":
            case "surface":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              st[headers[j]] = data[j];
              break;
            default:
              throw new Error(this.csvErrorMsg);
          }
        }
        lines.push(st);
      }
    }
    //console.log(lines); //The data in the form of 2 dimensional array.
    return lines;
  }

  extractSurveyData(arrayData): Survey[] | any[] {
    let allTextLines = arrayData.data;
    let delimiter = arrayData.meta.delimiter;
    let headers = allTextLines[0];
    let lines: Survey[] = [];
    let errorTab = [];
    for (let i = 1; i < allTextLines.length; i++) {
      let data = allTextLines[i];
      if (data.length == headers.length) {
        let st = {} as Survey;
        let header;
        for (let j = 0; j < headers.length; j++) {
          switch (headers[j]) {
            case "codeCountry":
            case "codePlatform":
            case "code":
            case "participants":
            case "surfaceStation":
            case "description":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              st[headers[j]] = data[j];
              break;
            case "dateStart":
            case "dateEnd":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              let d;
              // if it is french format reverse date and month in import date (from dd/MM/yyyy to MM/dd/yyyy)
              if (delimiter === Csv2JsonService.SEMICOLON) {
                //this.ms.moment().locale("fr");
                d = this.ms.moment(data[j], "DD/MM/YYYY").toISOString();
              } else {
                //this.ms.moment().locale("en");
                d = this.ms.moment(data[j], "MM/DD/YYYY").toISOString();
              }
              st[headers[j]] = d;
              break;
            default:
              if (!errorTab.includes(headers[j])) {
                errorTab.push(headers[j]);
              }
              break;
          }
        }
        lines.push(st);
      }
    }

    if (errorTab.length !== 0) {
      let string = "";
      for (let i in errorTab) {
        if (parseInt(i) === errorTab.length - 1) {
          string += errorTab[i] + ".";
        } else {
          string += errorTab[i] + ", ";
        }
      }

      return [{ error: string }];
    }

    //console.log(lines); //The data in the form of 2 dimensional array.
    return lines;
  }

  extractStationData(arrayData): Station[] | any[] {
    let allTextLines = arrayData.data;
    let headers = allTextLines[0];
    let lines = [];
    let geojsons = [];
    let errorTab = [];
    for (let i = 1; i < allTextLines.length; i++) {
      let data = allTextLines[i];
      if (data.length == headers.length) {
        let st = {} as Station;
        let header;
        for (let j = 0; j < headers.length; j++) {
          switch (headers[j]) {
            case "codePlatform":
            case "code":
            case "nom":
            case "latitude":
            case "longitude":
            case "description":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              st[headers[j]] = data[j];
              break;
            default:
              if (!errorTab.includes(headers[j])) {
                errorTab.push(headers[j]);
              }
              break;
          }
        }
        lines.push(st);
      }
    }

    if (errorTab.length !== 0) {
      let string = "";
      for (let i in errorTab) {
        if (parseInt(i) === errorTab.length - 1) {
          string += errorTab[i] + ".";
        } else {
          string += errorTab[i] + ", ";
        }
      }
      return [{ error: string }];
    }

    for (let i = 0; i < lines.length; i++) {
      let geojson = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [Number(lines[i]["longitude"]), Number(lines[i]["latitude"])]
        },
        properties: {
          name: lines[i]["nom"],
          code: lines[i]["code"],
          description: lines[i]["description"]
        },
        staticMapStation: "",
        codePlatform: lines[i]["codePlatform"]
      };

      // this.mapStaticService.staticMapToB64(this.mapStaticService.googleMapUrlPoint([Number(lines[i]["longitude"]), Number(lines[i]["latitude"])])).then(function(data) {
      //     geojson.staticMapStation = data.toString();
      // })

      geojsons.push(geojson);
    }

    return geojsons;
  }

  extractStationPreviewData(csvFile) {
    return Observable.create(observable => {
      this.papa.parse(csvFile, {
        skipEmptyLines: true,
        download: true,
        complete: function(results) {
          observable.next(results);
          observable.complete();
        }
      });
    }).map(arrayData => {
      let allTextLines = arrayData.data;
      let headers = allTextLines[0];
      let lines = [];
      let geojsons = [];
      let errorTab = [];
      for (let i = 1; i < allTextLines.length; i++) {
        let data = allTextLines[i];
        if (data.length == headers.length) {
          let st = {} as Station;
          let header;
          for (let j = 0; j < headers.length; j++) {
            switch (headers[j]) {
              case "codePlatform":
              case "code":
              case "nom":
              case "latitude":
              case "longitude":
              case "description":
                header = headers[j].replace(/_([a-z])/g, function(g) {
                  return g[1].toUpperCase();
                });
                st[headers[j]] = data[j];
                break;
              default:
                if (!errorTab.includes(headers[j])) {
                  errorTab.push(headers[j]);
                }
                break;
            }
          }
          lines.push(st);
        }
      }

      if (errorTab.length !== 0) {
        let string = "";
        for (let i in errorTab) {
          if (parseInt(i) === errorTab.length - 1) {
            string += errorTab[i] + ".";
          } else {
            string += errorTab[i] + ", ";
          }
        }

        return string;
      }

      for (let i = 0; i < lines.length; i++) {
        let geojson = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [Number(lines[i]["longitude"]), Number(lines[i]["latitude"])]
          },
          properties: {
            name: lines[i]["nom"],
            code: lines[i]["code"],
            description: lines[i]["description"]
          },
          staticMapStation: "",
          codePlatform: lines[i]["codePlatform"]
        };

        geojsons.push(geojson);
      }

      return geojsons;
    });
  }

  extractZonePrefData(arrayData, species): ZonePreference[] | any[] {
    let allTextLines = arrayData.data;
    let headers = allTextLines[0];
    let lines: ZonePreference[] = [];
    let errorTab = [];
    for (let i = 1; i < allTextLines.length; i++) {
      let data = allTextLines[i];
      if (data.length == headers.length) {
        let st = {} as ZonePreference;
        let header;
        for (let j = 0; j < headers.length; j++) {
          switch (headers[j]) {
            case "codePlatform":
            case "codeZone":
            case "code":
            case "codeSpecies":
            case "presence":
            case "infoSource":
            case "picture":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              st[headers[j]] = data[j];
              break;
            default:
              if (!errorTab.includes(headers[j])) {
                errorTab.push(headers[j]);
              }
              break;
          }
        }

        lines.push(st);
      }
    }

    if (errorTab.length !== 0) {
      let string = "";
      for (let i in errorTab) {
        if (parseInt(i) === errorTab.length - 1) {
          string += errorTab[i] + ".";
        } else {
          string += errorTab[i] + ", ";
        }
      }

      return [{ error: string }];
    }

    //console.log(lines); //The data in the form of 2 dimensional array.
    return lines;
  }

  extractCountData(arrayData) {
    let allTextLines = arrayData.data;
    let delimiter = arrayData.meta.delimiter;
    let headers = allTextLines[0];
    let lines: Count[] = [];
    let errorTab = [];

    for (let i = 1; i < allTextLines.length; i++) {
      let data = allTextLines[i];
      if (data.length == headers.length) {
        let ct = {} as Count;
        let header;
        for (let j = 0; j < headers.length; j++) {
          switch (headers[j]) {
            case "codePlatform":
            case "codeSurvey":
            case "code":
            case "codeStation":
              header = headers[j].replace(/_([a-z])/g, function(g) {
                return g[1].toUpperCase();
              });
              ct[headers[j]] = data[j];
              break;
            case "date":
              let d;
              // if it is french format reverse date and month in import date (from dd/MM/yyyy to MM/dd/yyyy)
              if (delimiter === Csv2JsonService.SEMICOLON) {
                //this.ms.moment().locale("fr");
                d = this.ms.moment(data[j], "DD/MM/YYYY").toISOString();
              } else {
                //this.ms.moment().locale("en");
                d = this.ms.moment(data[j], "MM/DD/YYYY").toISOString();
              }
              ct[headers[j]] = d;
              break;
            case "mesures":
              let sp = data[headers.indexOf("codeSpecies")];
              // if there is no species name (let size of 2 for undesired spaces) break;
              if (sp.length < 2) break;
              if (ct.mesures == null) ct.mesures = [];
              let mes = data[j].split(",");
              for (let dims of mes) {
                let longlarg = dims.split("/");
                ct.mesures.push({ codeSpecies: sp, long: longlarg[0], larg: longlarg.length > 0 ? longlarg[1] : "0" });
              }
              break;
            case "codeSpecies":
              ct["monospecies"] = true;
              break;
            default:
              if (!errorTab.includes(headers[j])) {
                errorTab.push(headers[j]);
              }
              break;
          }
        }
        lines.push(ct);
      }
    }

    if (errorTab.length !== 0) {
      let string = "";
      for (let i in errorTab) {
        if (parseInt(i) === errorTab.length - 1) {
          string += errorTab[i] + ".";
        } else {
          string += errorTab[i] + ", ";
        }
      }

      return [{ error: string }];
    }
    if (allTextLines.length > 201) {
      return [{ error: "TOO_MUCH_ENTITY_COUNT" }];
    }

    //console.log(lines); //The data in the form of 2 dimensional array.
    return lines;
  }

  extractCountPreviewData(csvFile) {
    return Observable.create(observable => {
      this.papa.parse(csvFile, {
        skipEmptyLines: true,
        download: true,
        complete: function(results) {
          observable.next(results);
          observable.complete();
        }
      });
    }).map(arrayData => {
      let allTextLines = arrayData.data;
      let delimiter = arrayData.meta.delimiter;
      let headers = allTextLines[0];
      let lines: Count[] = [];
      let errorTab = [];
      for (let i = 1; i < allTextLines.length; i++) {
        let data = allTextLines[i];
        if (data.length == headers.length) {
          let ct = {} as Count;
          let header;
          for (let j = 0; j < headers.length; j++) {
            switch (headers[j]) {
              case "codePlatform":
              case "codeSurvey":
              case "code":
              case "codeStation":
                header = headers[j].replace(/_([a-z])/g, function(g) {
                  return g[1].toUpperCase();
                });
                ct[headers[j]] = data[j];
                break;
              case "date":
                let d;
                // if it is french format reverse date and month in import date (from dd/MM/yyyy to MM/dd/yyyy)
                if (delimiter === Csv2JsonService.SEMICOLON) {
                  //this.ms.moment().locale("fr");
                  d = this.ms.moment(data[j], "DD/MM/YYYY").toISOString();
                } else {
                  //this.ms.moment().locale("en");
                  d = this.ms.moment(data[j], "MM/DD/YYYY").toISOString();
                }
                ct[headers[j]] = d;
                break;
              case "mesures":
                let sp = data[headers.indexOf("codeSpecies")];
                // if there is no species name (let size of 2 for undesired spaces) break;
                if (sp.length < 2) break;
                if (ct.mesures == null) ct.mesures = [];
                let mes = data[j].split(",");
                for (let dims of mes) {
                  let longlarg = dims.split("/");
                  ct.mesures.push({ codeSpecies: sp, long: longlarg[0], larg: longlarg.length > 0 ? longlarg[1] : "0" });
                }
                break;
              case "codeSpecies":
                ct["monospecies"] = true;
                break;
              default:
                if (!errorTab.includes(headers[j])) {
                  errorTab.push(headers[j]);
                }
                break;
            }
          }
          lines.push(ct);
        }
      }

      if (errorTab.length !== 0) {
        let string = "";
        for (let i in errorTab) {
          if (parseInt(i) === errorTab.length - 1) {
            string += errorTab[i] + ".";
          } else {
            string += errorTab[i] + ", ";
          }
        }

        return string;
      }
      if (allTextLines.length > 201) {
        return [{ error: "TOO_MUCH_ENTITY_COUNT" }];
      }
      //console.log(lines); //The data in the form of 2 dimensional array.
      return lines;
    });
  }

  csv2(type: string, csvFile: any, species?: Species[]): Observable<any> {
    return Observable.create(observable => {
      this.papa.parse(csvFile, {
        /*delimiter: function(csvFile){
                                return ",";
                            },*/
        skipEmptyLines: true,
        download: true,
        complete: function(results) {
          if (!results.data[0].indexOf("code_species")) throw new Error('Wrong CSV File Missing mandatory "code" column');
          observable.next(results);
          observable.complete();
        }
      });
    }).pipe(
      mergeMap(data => {
        //console.log(data);
        let res;
        switch (type) {
          case "species":
            res = this.extractSpeciesData(data);
            break;
          case "platform":
            res = this.extractPlatformData(data);
            break;
          case "zone":
            res = this.extractZoneData(data);
            break;
          case "survey":
            res = this.extractSurveyData(data);
            break;
          case "zonePref":
            res = this.extractZonePrefData(data, species);
            break;
          case "station":
            res = this.extractStationData(data);
            break;
          case "count":
            res = this.extractCountData(data);
            break;
          default:
            // code...
            break;
        }
        //console.log(res);
        return res;
      })
    );
  }
}

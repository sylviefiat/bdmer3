import { Injectable, Output, EventEmitter } from "@angular/core";
import { Observable, of, from, pipe, throwError, combineLatest } from "rxjs";
import { map, filter, mergeMap } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

import * as PouchDB from "pouchdb";
import { ResponsePDB } from "../../core/models/pouchdb";
import { Platform, Zone, Property, Survey, Station, ZonePreference, Count } from "../models/platform";
import { Country } from "../../countries/models/country";
import { Species } from "../../datas/models/species";

@Injectable()
export class PlatformService {
  private currentPlatform: Observable<Platform>;
  private db: any;

  constructor(private translate: TranslateService) {
    //this.dbname = "platforms";
  }

  initDB(dbname, remote, prefix): Observable<any> {
    //console.log(dbname);
    this.db = new PouchDB(prefix + dbname, { revs_limit: 3 });
    return from(this.sync(remote + "/" + prefix + dbname));
  }

  public getAll(): Observable<any> {
    return from(this.db.allDocs({ include_docs: true })).pipe(map((result: ResponsePDB) => result.rows.map(row => row.doc)));
  }

  getPlatform(platformCode: string): Observable<Platform> {
    return from(
      this.db.query(
        function(doc, emit) {
          emit(doc.code.toLowerCase());
        },
        { key: platformCode.toLowerCase(), include_docs: true }
      )
    ).pipe(map((result: ResponsePDB) => result.rows && result.rows[0] && result.rows[0].doc));
  }

  addPlatform(platform: Platform): Observable<Platform> {
    platform._id = platform.code;
    this.currentPlatform = of(platform);
    return from(this.db.put(platform)).pipe(
      filter((response: ResponsePDB) => {
        return response.ok;
      }),
      mergeMap(response => this.currentPlatform)
    );
  }

  importPlatforms(platforms: Platform[], country : Country): Observable<Platform[]> {
    return combineLatest(platforms.map((platform) => this.editPlatform(platform,country)));
  }

  importPlatformVerification(platforms: Platform[], countries: Country[]): Observable<string[]> {    
    let msg = this.translate.instant(["PLATFORM", "CANNOT_BE_INSERTED_COUNTRY", "NOT_IN_DATABASE"]);
    let errors = [];
    for(let platform of platforms){
      if (!platform.error) {
        if (countries.map(country => country.code).indexOf(platform.codeCountry) < 0)
          errors= this.addError(errors,msg.PLATFORM + platform.code + msg.CANNOT_BE_INSERTED_COUNTRY + platform.codeCountry + msg.NOT_IN_DATABASE);
      }
    }
    return of(errors);
  }

  editPlatform(platform: Platform, country: Country): Observable<Platform> {
    let msg = this.translate.instant("IMPORT_ERROR_PLATFORM");
    platform._id = platform.code;
    return this.getPlatform(platform.code).pipe(
      mergeMap(st => {
        if (!platform.zones) platform.zones = [];
        if (!platform.surveys) platform.surveys = [];
        if (!platform.stations) platform.stations = [];
        if (!platform.codeCountry && country !== undefined) {
          platform.codeCountry = country.code;
        }
        if (platform.codeCountry === null) {
          return throwError(msg.IMPORT_ERROR_PLATFORM);
        }
        if (st) {
          platform._rev = st._rev;
        }
        this.currentPlatform = of(platform);
        return from(this.db.put(platform));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => this.currentPlatform)
    );
  }

  removePlatform(platform: Platform): Observable<Platform> {
    return from(this.db.remove(platform)).pipe(
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(platform))
    );
  }

  editZone(zone: Zone, platform: Platform): Observable<Zone> {
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        if (!zone.codePlatform) zone.codePlatform = platform.code;
        if (!pt.zones) pt.zones = [];
        if (!pt.stations) pt.stations = [];
        if (!zone.zonePreferences) zone.zonePreferences = [];
        pt.zones = [...pt.zones.filter(z => z.properties.code !== zone.properties.code), zone];
        this.currentPlatform = of(pt);
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(zone))
    );
  }

  importZones(zones: Zone[], platform: Platform): Observable<Zone[]> {
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        this.currentPlatform = of(pt);
        for(let zone of zones){
          if (!zone.codePlatform) zone.codePlatform = platform.code;
          if (!pt.zones) pt.zones = [];
          if (!pt.stations) pt.stations = [];
          if (!zone.zonePreferences) zone.zonePreferences = [];
          pt.zones = [...pt.zones.filter(z => z.properties.code !== zone.properties.code), zone];                  
        }
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(zones)) 
    );
  }

  removeZone(zone: Zone): Observable<Zone> {
    return this.getPlatform(zone.codePlatform).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        pt.zones = pt.zones.filter(z => z.properties.code !== zone.properties.code);
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(zone))
    );
  }

  removeAllZone(platform: Platform) {
    return this.getPlatform(platform.code).pipe(
      mergeMap(pt => {
        pt.zones = [];
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(platform))
    );
  }

  editSurvey(platform: Platform, survey: Survey): Observable<Survey> {
    let msg = this.translate.instant("IMPORT_ERROR_SURVEY");

    if (platform.code.toLowerCase() !== survey.codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_SURVEY);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        if (!survey.counts) survey.counts = [];
        survey.codeCountry = pt.codeCountry;
        pt.surveys = [...pt.surveys.filter(c => c.code !== survey.code), survey];
        this.currentPlatform = of(pt);
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(survey))
    );
  }

  importSurveys(platform: Platform, surveys: Survey[]): Observable<Survey[]> {
    let msg = this.translate.instant("IMPORT_ERROR_SURVEY");

    if (platform.code.toLowerCase() !== surveys[0].codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_SURVEY);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        this.currentPlatform = of(pt);
        for(let survey of surveys){
          if (!survey.counts) survey.counts = [];
          survey.codeCountry = pt.codeCountry;
          pt.surveys = [...pt.surveys.filter(c => c.code !== survey.code), survey];
        }
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(surveys))
    );
  }

  importSurveyVerification(surveys: Survey[], platform: Platform): Observable<string[]> {
    let msg = this.translate.instant(['PLATFORM', 'SURFACE_NOT_NUMBER', 'SURFACE_NOT_DEFINED', 'NO_PLATFORM', 'FOR_COUNTRY', 'AND_COUNTRY', 'NOT_PART_OF_COUNTRY', 'NOT_IN_DATABASE']);
    let errors = [];
    for(let survey of surveys){
      if (!survey.error) {
        if (survey.codePlatform.toLowerCase() !== platform.code.toLowerCase() && survey.codeCountry === platform.codeCountry) {
          errors= this.addError(errors,msg.NO_PLATFORM + survey.codePlatform + msg.FOR_COUNTRY + survey.codeCountry);
        }

        if (survey.codePlatform.toLowerCase() === platform.code.toLowerCase() && survey.codeCountry !== platform.codeCountry) {
          errors= this.addError(errors,msg.PLATFORM + survey.codePlatform + msg.NOT_PART_OF_COUNTRY + survey.codeCountry);
        }

        if (survey.codePlatform.toLowerCase() !== platform.code.toLowerCase() && survey.codeCountry !== platform.codeCountry) {
          errors= this.addError(errors,msg.PLATFORM + survey.codePlatform + msg.AND_COUNTRY + survey.codeCountry + msg.NOT_IN_DATABASE);
        }

        if(!survey.surfaceStation){
          errors= this.addError(errors,"Survey " + survey.code + msg.SURFACE_NOT_DEFINED);
        }
      }
    }
    return of(errors);
  }

  removeSurvey(survey: Survey): Observable<Survey> {
    return this.getPlatform(survey.codePlatform).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        let zn = pt.zones.filter(z => z.properties.code === survey.code)[0];
        pt.surveys = pt.surveys.filter(c => c.code !== survey.code);
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(survey))
    );
  }

  editStation(platform: Platform, station: Station): Observable<Station> {
    let msg = this.translate.instant("IMPORT_ERROR_STATION");
    if (platform.code.toLowerCase() !== station.codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_STATION);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        pt.stations = [...pt.stations.filter(t => t.properties.code !== station.properties.code), station];
        this.currentPlatform = of(pt);
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(station))
    );
  }

  removeStation(station: Station): Observable<Station> {
    return this.getPlatform(station.codePlatform).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        pt.stations = pt.stations.filter(t => t.properties.code !== station.properties.code);
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(station))
    );
  }

  importStations(platform: Platform, stations: Station[]): Observable<Station[]> {
    let msg = this.translate.instant("IMPORT_ERROR_STATION");

    if (platform.code.toLowerCase() !== stations[0].codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_STATION);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        this.currentPlatform = of(pt);
        for(let station of stations) {
          station.codePlatform = pt.code;
          pt.stations = [...pt.stations.filter(s => s.properties.code !== station.properties.code), station];
        }
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(stations))
    );
  }

  importStationVerification(stations: Station[], platform: Platform): Observable<string[]> {
    let msg = this.translate.instant(['STATION', 'CANNOT_BE_INSERTED_CODEPLATFORM', 'NOT_IN_DATABASE','NO_COORDINATES','WRONG_COORD_FORMAT']);
    let errors: string[] = [];
    for(let station of stations){
      if(!station.error){
        if (station.codePlatform.toLowerCase() !== platform.code.toLowerCase()) {
          errors=this.addError(errors,msg.STATION + station.properties.name + msg.CANNOT_BE_INSERTED_CODEPLATFORM + station.codePlatform + msg.NOT_IN_DATABASE);
        } else if(!station.geometry || !station.geometry.coordinates || station.geometry.coordinates[0]===null || station.geometry.coordinates[1]===null){
          errors= this.addError(errors,msg.STATION + station.properties.name + msg.NO_COORDINATES);
        } else if(typeof station.geometry.coordinates[0] !== "number" || typeof station.geometry.coordinates[1] !== "number" || 
          isNaN(station.geometry.coordinates[0]) || isNaN(station.geometry.coordinates[1])){
          errors= this.addError(errors,msg.STATION + station.properties.name + msg.WRONG_COORD_FORMAT);
        }
      }
    }
    return of(errors);
  }

  editZonePref(platform: Platform, zonePref: ZonePreference): Observable<ZonePreference> {
    let msg = this.translate.instant("IMPORT_ERROR_ZONEPREF");

    if (platform.code.toLowerCase() !== zonePref.codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_ZONEPREF);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(st => {
        let zn = st.zones.filter(z => z.properties.code === zonePref.codeZone)[0];
        if (zn) {
          if (zn.zonePreferences.filter(zp => zp.code === zonePref.code).length > -1) {
            zn.zonePreferences = [...zn.zonePreferences.filter(zp => zp.code !== zonePref.code), zonePref];
          }
          st.zones = [...st.zones.filter(z => z.properties.code !== zn.properties.code), zn];
        }
        this.currentPlatform = of(st);
        return from(this.db.put(st));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(zonePref))
    );
  }

  importZonePrefVerification(zonePrefs: ZonePreference[], platform: Platform, species: Species[]): Observable<string[]> {
    let msg = this.translate.instant([
      "CODE_SPECIES",
      "CANNOT_BE_INSERTED_NOT_EXIST",
      "CANNOT_BE_INSERTED_CODEZONE",
      "CANNOT_BE_INSERTED_CODEPLATFORM",
      "NOT_IN_DATABASE",
      "ZONE_PREF"
    ]);
    let errors = [];
    for(let zonePref of zonePrefs){
      if (!zonePref.error) {
        if(zonePref.codePlatform.toLowerCase() !== platform.code.toLowerCase()){
          errors = this.addError(errors,msg.ZONE_PREF + zonePref.code + msg.CANNOT_BE_INSERTED_CODEPLATFORM + zonePref.codePlatform + msg.NOT_IN_DATABASE);
        }
        if(platform.zones.filter(z => z.properties.code===zonePref.codeZone).length<0){
          errors = this.addError(errors,msg.ZONE_PREF + zonePref.code + msg.CANNOT_BE_INSERTED_CODEZONE + zonePref.codeZone + msg.NOT_IN_DATABASE);
        }
        if(species.filter(sp => sp.code === zonePref.codeSpecies).length<0){
          errors = this.addError(errors,msg.CODE_SPECIES + zonePref.codeSpecies + msg.CANNOT_BE_INSERTED_NOT_EXIST);
        }        
      } 
    }
    return of(errors);
  }

  importZonePrefs(platform: Platform, zonePrefs: ZonePreference[]): Observable<ZonePreference[]> {
    let msg = this.translate.instant("IMPORT_ERROR_ZONE_PREFERENCE");

    if (platform.code.toLowerCase() !== zonePrefs[0].codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_ZONE_PREFERENCE);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        this.currentPlatform = of(pt);        
        for(let zonePref of zonePrefs) {
          zonePref.codePlatform = pt.code;
          let zone = pt.zones.filter(z => z.properties.code === zonePref.codeZone)[0];
          zone.zonePreferences = [...zone.zonePreferences.filter(zp => zp.code !== zonePref.code),zonePref];
          pt.zones = [...pt.zones.filter(z => z.properties.code !== zone.properties.code), zone];
        }
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(zonePrefs))
    );
  }

  removeZonePref(zonePref: ZonePreference): Observable<ZonePreference> {
    return this.getPlatform(zonePref.codePlatform).pipe(
      filter(platform => platform !== null),
      mergeMap(st => {
        let zn = st.zones.filter(z => z.properties.code === zonePref.codeZone)[0];
        zn.zonePreferences = zn.zonePreferences.filter(zn => zn.code !== zonePref.code);
        st.zones = [...st.zones.filter(z => z.properties.code !== zonePref.codeZone), zn];
        return from(this.db.put(st));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(zonePref))
    );
  }

  editCount(platform: Platform, count: Count): Observable<Count> {
    let msg = this.translate.instant("IMPORT_ERROR_COUNT");

    if (platform.code.toLowerCase() !== count.codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_COUNT);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(st => {
        if (!count.mesures) count.mesures = [];
        if (!count.mesures) count.quantities = [];
        let cp = st.surveys.filter(c => c.code === count.codeSurvey)[0];
        if (cp) {
          if (cp.counts.filter(c => c.code === count.code).length > -1) {
            cp.counts = [...cp.counts.filter(c => c.code !== count.code), count];
          }
          st.surveys = [...st.surveys.filter(c => c.code != count.codeSurvey), cp];
        }
        this.currentPlatform = of(st);
        return from(this.db.put(st));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(count))
    );
  }

  importCountVerification(counts:Count[], platform: Platform, species: Species[]): Observable<string[]> {
    let errors = [];
    for(let count of counts){
      if (!count.error) {
        let msg = this.translate.instant(["PLATFORM", "CANNOT_BE_INSERTED_NOT_EXIST", "NO_STATION_IN_DB", "NO_SPECIES_IN_DB", "NO_SURVEY_IN_DB"]);
        if(!species || species.length <= 0){
          errors= this.addError(errors,msg.NO_SPECIES_IN_DB);
        }
        if(!platform){
          errors= this.addError(errors,msg.PLATFORM + count.codePlatform + msg.CANNOT_BE_INSERTED_NOT_EXIST);
        } else {
          if(!platform.stations || platform.stations.length<=0){
            errors= this.addError(errors,msg.NO_STATION_IN_DB + count.codePlatform);
          }
          else if(platform.stations.filter((st:Station) => st.properties.code === count.codeStation).length <= 0){
            errors= this.addError(errors,"CodeStation " + count.codeStation + msg.CANNOT_BE_INSERTED_NOT_EXIST)
          }
          if(!platform.surveys || platform.surveys.length <= 0){
            errors= this.addError(errors,msg.NO_SURVEY_IN_DB + count.codeSurvey)
          }
          else if(platform.surveys.filter((sv:Survey) => sv.code === count.codeSurvey).length <= 0){
            errors= this.addError(errors,"CodeSurvey " + count.codeSurvey + msg.CANNOT_BE_INSERTED_NOT_EXIST);
          }
          if(count.mesures && count.mesures.length >0){
            for(let noSp of count.mesures.filter(m => species.map(sp => sp.code).indexOf(m.codeSpecies)<0)){
              errors= this.addError(errors,"CodeSpecies " + noSp + msg.CANNOT_BE_INSERTED_NOT_EXIST);
            }
          }
        }
      }
    }
    return of(errors);
  }

  addError(errors:string[],msg:string): string[]{
    if(errors.indexOf(msg)<0) {
      errors.push(msg);
    }
    return errors;
  }

  importCounts(platform: Platform, counts: Count[]): Observable<Count[]> {
    let msg = this.translate.instant("IMPORT_ERROR_COUNT");
    if (platform.code.toLowerCase() !== counts[0].codePlatform.toLowerCase()) return throwError(msg.IMPORT_ERROR_COUNT);
    return this.getPlatform(platform.code).pipe(
      filter(platform => platform !== null),
      mergeMap(pt => {
        this.currentPlatform = of(pt);
        for(let count of counts) {
          count.codePlatform = pt.code;
          if(!count.quantities){count.quantities=[]}
          if(!count.mesures){count.mesures=[]}
          let survey = pt.surveys.filter(sv => sv.code === count.codeSurvey)[0];
          survey.counts = [...survey.counts.filter(c => c.code !== count.code),count];
          pt.surveys = [...pt.surveys.filter(sv => sv.code !== survey.code), survey];
        }
        return from(this.db.put(pt));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(counts))
    );
  }

  removeCount(count: Count): Observable<Count> {
    return this.getPlatform(count.codePlatform).pipe(
      filter(platform => platform !== null),
      mergeMap(st => {
        let ca = st.surveys.filter(c => c.code === count.codeSurvey)[0];
        ca.counts = ca.counts.filter(ct => ct.code !== count.code);
        st.surveys = [...st.surveys.filter(c => c.code !== count.codeSurvey), ca];
        return from(this.db.put(st));
      }),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => of(count))
    );
  }

  public sync(remote: string): Promise<any> {
    let remoteDatabase = new PouchDB(remote);
    return this.db
      .sync(remoteDatabase, {
        live: true,
        retry: true
      })
      .on("error", error => {
        console.error(JSON.stringify(error));
      });
  }
}

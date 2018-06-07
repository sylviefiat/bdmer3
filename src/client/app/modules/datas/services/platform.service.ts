import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of, from, pipe, throwError } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';
import { MapStaticService} from '../../core/services/map-static.service';
import {TranslateService} from '@ngx-translate/core';

import * as PouchDB from "pouchdb";
import { ResponsePDB } from '../../core/models/pouchdb';
import { Platform, Zone, Property, Survey, Station, ZonePreference, Count } from '../models/platform';
import { Country } from '../../countries/models/country';
import { Species } from '../../datas/models/species';

@Injectable()
export class PlatformService {
  private currentPlatform: Observable<Platform>;
  private db: any;

  constructor(private translate: TranslateService, private mapStaticService: MapStaticService) {
  }

  initDB(dbname: string, remote: string): Observable<any> {
    //console.log(dbname);
    this.db = new PouchDB(dbname);
    return from(this.sync(remote + dbname));
  }

  public getAll(): Observable<any> {
   return from(this.db.allDocs({ include_docs: true }))
      .pipe(map((result: ResponsePDB) => result.rows.map(row => row.doc)));
  }

  getPlatform(platformCode: string): Observable<Platform> {
    return from(this.db.query(function(doc, emit) {
      emit(doc.code);
    }, { key: platformCode, include_docs: true }))
    .pipe(map((result: ResponsePDB) => result.rows && result.rows[0] && result.rows[0].doc));
  }

  addPlatform(platform: Platform): Observable<Platform> {
    platform._id=platform.code;
    this.currentPlatform = of(platform);
    return from(this.db.put(platform)).pipe(
      filter((response: ResponsePDB) => { return response.ok; }),
      mergeMap(response => this.currentPlatform));
  }

  importPlatform(platform: Platform[]): Observable<Observable<Platform>> {
    return of(platform)
      .pipe(map((sp, i) => this.addPlatform(sp[i])));
  }

  importPlatformVerification(platform, countries: Country[]): Observable<string> {
    let msg = this.translate.instant(['PLATFORM', 'CANNOT_BE_INSERTED_COUNTRY', 'NOT_IN_DATABASE']);

    if(countries.filter(country => country.code === platform.codeCountry).length===0)
      return of(msg.PLATFORM + platform.code + msg.CANNOT_BE_INSERTED_COUNTRY + platform.codeCountry + msg.NOT_IN_DATABASE);  
    return of(''); 
  }

  editPlatform(platform: Platform, country: Country): Observable<Platform> {
    let msg = this.translate.instant('IMPORT_ERROR_PLATFORM');
    platform._id=platform.code;
    return this.getPlatform(platform.code)
      .pipe(
        mergeMap(st => {  
          if (!platform.zones) platform.zones = []; 
          if(!platform.surveys) platform.surveys = [];
          if(country !== undefined){
            platform.codeCountry = country.code;
          }
          if(platform.codeCountry === null){
            return throwError(msg.IMPORT_ERROR_PLATFORM);
          }      
          if(st) {platform._rev = st._rev;}
          this.currentPlatform = of(platform);
          return from(this.db.put(platform));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap((response) => this.currentPlatform)
      );
  }

  removePlatform(platform: Platform): Observable<Platform> {    
    return from(this.db.remove(platform))
      .pipe(
        filter((response: ResponsePDB) => response.ok),
        mergeMap(response => of(platform))
      );
  }

  editZone(zone: Zone, platform: Platform): Observable<Zone> {
    var url = this.mapStaticService.googleMapUrl(zone.geometry["coordinates"])

    this.mapStaticService.staticMapToB64(url).then(function(data){
      zone.staticmap = data.toString();
    })

    return this.getPlatform(platform.code)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(pt => {           
          if(!zone.codePlatform) zone.codePlatform=platform.code;
          if(!pt.zones) pt.zones = [];
          if(!pt.stations) pt.stations = [];
          if(!zone.zonePreferences) zone.zonePreferences = [];
          pt.zones = [ ...pt.zones.filter(z => z.properties.code !== zone.properties.code), zone];
          this.currentPlatform = of(pt);
          return from(this.db.put(pt));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap((response) => of(zone))
      );
  }

  removeZone(zone: Zone): Observable<Zone> {    
    return this.getPlatform(zone.codePlatform)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(pt => {
          pt.zones = pt.zones.filter(z => z.properties.code !== zone.properties.code);
          return from(this.db.put(pt));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap(response => of(zone))
      );
  }

  editSurvey(platform: Platform, survey: Survey): Observable<Survey> {
    let msg = this.translate.instant('IMPORT_ERROR_SURVEY');

    if(platform.code !== survey.codePlatform)
      return throwError(msg.IMPORT_ERROR_SURVEY);
    return this.getPlatform(platform.code)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(pt => { 
          if(!survey.counts) survey.counts = [];
          survey.codeCountry = pt.codeCountry;
          pt.surveys = [ ...pt.surveys.filter(c => c.code !== survey.code), survey];     
          this.currentPlatform = of(pt);
          return from(this.db.put(pt));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap((response) => of(survey))
      )
    }

  importSurveyVerification(survey: Survey, platform: Platform): Observable<string>{
    let msg = this.translate.instant(['PLATFORM', 'NO_PLATFORM', 'FOR_COUNTRY', 'AND_COUNTRY', 'NOT_PART_OF_COUNTRY', 'NOT_IN_DATABASE']);

    if(survey.codePlatform !== platform.code && survey.codeCountry === platform.codeCountry){
      return of(msg.NO_PLATFORM + survey.codePlatform + msg.FOR_COUNTRY + survey.codeCountry);
    }

    if(survey.codePlatform === platform.code && survey.codeCountry !== platform.codeCountry){
      return of(msg.PLATFORM + survey.codePlatform + msg.NOT_PART_OF_COUNTRY + survey.codeCountry);
    }

    if(survey.codePlatform !== platform.code && survey.codeCountry !== platform.codeCountry){
      return of(msg.PLATFORM + survey.codePlatform + msg.AND_COUNTRY + survey.codeCountry + msg.NOT_IN_DATABASE);
    }

    return of('');
  }

  removeSurvey(survey: Survey): Observable<Survey> {    
    return this.getPlatform(survey.codePlatform)
      .pipe(
        filter(platform => platform!==null),
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
    let msg = this.translate.instant('IMPORT_ERROR_STATION');
    if(platform.code !== station.codePlatform)
      return throwError(msg.IMPORT_ERROR_STATION);
    return this.getPlatform(platform.code)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(pt => {  
          pt.stations = [ ...pt.stations.filter(t => t.properties.code !== station.properties.code), station];         
          this.currentPlatform = of(pt);
          return from(this.db.put(pt));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap((response) => of(station))
      );
  }

  removeStation(station: Station): Observable<Station> {    
    return this.getPlatform(station.codePlatform)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(pt => {
          pt.stations = pt.stations.filter(t => t.properties.code !== station.properties.code);
          return from(this.db.put(pt));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap(response => of(station))
      );
  }

  importStationVerification(station, platform: Platform): Observable<string>{
    let msg = this.translate.instant(['STATION', 'CANNOT_BE_INSERTED_CODEPLATFORM', 'NOT_IN_DATABASE']);
    if(station.codePlatform === platform.code){
      return of('');
    }else{
      return of(msg.STATION + station.properties.name + msg.CANNOT_BE_INSERTED_CODEPLATFORM + station.codePlatform + msg.NOT_IN_DATABASE);
    }
  }

  editZonePref(platform: Platform, zonePref: ZonePreference): Observable<ZonePreference> {
    let msg = this.translate.instant('IMPORT_ERROR_ZONEPREF');

    if(platform.code !== zonePref.codePlatform)
      return throwError(msg.IMPORT_ERROR_ZONEPREF);
    return this.getPlatform(platform.code)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(st => {  
          let zn = st.zones.filter(z => z.properties.code === zonePref.codeZone)[0];
          if(zn){
            if(zn.zonePreferences.filter(zp => zp.code === zonePref.code).length > -1){
              zn.zonePreferences = [ ...zn.zonePreferences.filter(zp => zp.code !== zonePref.code), zonePref];
            }
            st.zones = [ ...st.zones.filter(z => z.properties.code !== zn.properties.code), zn];
          } 
          this.currentPlatform = of(st);
          return from(this.db.put(st));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap((response) => of(zonePref))
      );
  }

  importZonePrefVerification(zonePref: ZonePreference, platform: Platform, species: Species[]): Observable<string>{
    let msg = this.translate.instant(['CODE_SPECIES', 'CANNOT_BE_INSERTED_NOT_EXIST', 'CANNOT_BE_INSERTED_CODEZONE', 'CANNOT_BE_INSERTED_CODEPLATFORM', 'NOT_IN_DATABASE', "ZONE_PREF"]);

    if(zonePref.codePlatform === platform.code){
      for(let i = 0; i < platform.zones.length; i++){
        if(zonePref.codeZone === platform.zones[i].properties.code){
          for(let y = 0; y < species.length; y++){
            if(zonePref.codeSpecies === species[y].code){
              return of('');
            }
            if(zonePref.codeSpecies !== species[y].code && y === species.length - 1){
              return of(msg.CODE_SPECIES + zonePref.codeSpecies + msg.CANNOT_BE_INSERTED_NOT_EXIST);
            }
          }
        }
        if(zonePref.codeZone !== platform.zones[i].properties.code && i === platform.zones.length - 1){
          return of(msg.ZONE_PREF + zonePref.code + msg.CANNOT_BE_INSERTED_CODEZONE + zonePref.codeZone + msg.NOT_IN_DATABASE);
        }
      }
    }else{
      return of(msg.ZONE_PREF + zonePref.code + msg.CANNOT_BE_INSERTED_CODEPLATFORM + zonePref.codePlatform + msg.NOT_IN_DATABASE);
    }

    return of('')
  }

  removeZonePref(zonePref: ZonePreference): Observable<ZonePreference> {    
    return this.getPlatform(zonePref.codePlatform)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(st => {
          let zn = st.zones.filter(z => z.properties.code === zonePref.codeZone)[0];
          zn.zonePreferences = zn.zonePreferences.filter(zn => zn.code !== zonePref.code);
          st.zones = [...st.zones.filter(z => z.properties  .code !== zonePref.codeZone),zn];
          return from(this.db.put(st));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap(response => of(zonePref))
      );
  }

  editCount(platform: Platform, count: Count): Observable<Count> {
    let msg = this.translate.instant('IMPORT_ERROR_COUNT');

    if(platform.code !== count.codePlatform)
      return throwError(msg.IMPORT_ERROR_COUNT);
    return this.getPlatform(platform.code)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(st => {  
          if(!count.mesures) count.mesures = [];
          let cp = st.surveys.filter(c => c.code === count.codeSurvey)[0];
          if(cp){
            if(cp.counts.filter(c => c.code === count.code).length > -1){
              cp.counts = [ ...cp.counts.filter(c => c.code !== count.code), count];
            }
            st.surveys = [...st.surveys.filter(c => c.code != count.codeSurvey), cp];
          }  
          this.currentPlatform = of(st);
          return from(this.db.put(st));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap((response) => of(count))
      );
  }

  importCountVerification(count: Count, platform: Platform, species: Species[]): Observable<string>{
    let msg = this.translate.instant(['PLATFORM', 'CANNOT_BE_INSERTED_NOT_EXIST', 'NO_STATION_IN_DB', 'NO_SPECIES_IN_DB', 'NO_SURVEY_IN_DB']);

    if(count.codePlatform === platform.code){
      if(platform.stations.length > 0){
        for(let i in platform.stations){
          if(count.codeStation === platform.stations[i].properties.code){
            if(platform.surveys.length > 0){
              for(let x in platform.surveys){
                if(count.codeSurvey === platform.surveys[x].code){
                  if(species.length > 0){
                    for(let y in species){
                      if(count.mesures[0].codeSpecies === species[y].code){
                        return of('')
                      }
                      if(count.mesures[0].codeSpecies !== species[y].code && parseInt(y) === species.length - 1){
                        return of("CodeSpecies " + count.mesures[0].codeSpecies + msg.CANNOT_BE_INSERTED_NOT_EXIST);
                      }
                    }
                  }else{
                    return of(msg.NO_SPECIES_IN_DB);
                  }
                }
                if(count.codeSurvey !== platform.surveys[x].code && parseInt(x) === platform.surveys.length - 1){
                  return of("CodeSurvey " + count.codeSurvey + msg.CANNOT_BE_INSERTED_NOT_EXIST);
                }
              } 
            }else{
              return of(msg.NO_SURVEY_IN_DB + count.codePlatform);
            }
          }
          if(count.codeStation !== platform.stations[i].properties.code && parseInt(i) === platform.stations.length - 1){
            return of("CodeStation "+count.codeStation+ msg.CANNOT_BE_INSERTED_NOT_EXIST);
          }
        }
      }else{
        return of(msg.NO_STATION_IN_DB+ count.codePlatform);
      }
    }else{
      return of(msg.PLATFORM + count.codePlatform + msg.CANNOT_BE_INSERTED_NOT_EXIST);
    }
    return of('');
  }

  removeCount(count: Count): Observable<Count> {    
    return this.getPlatform(count.codePlatform)
      .pipe(
        filter(platform => platform!==null),
        mergeMap(st => {
          let ca = st.surveys.filter(c => c.code === count.codeSurvey)[0];
          ca.counts = ca.counts.filter(ct => ct.code !== count.code);
          st.surveys = [...st.surveys.filter(c => c.code !== count.codeSurvey),ca];
          return from(this.db.put(st));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap(response => of(count))
      );
  }

  public sync(remote: string): Promise<any> {
    let remoteDatabase = new PouchDB(remote);
    return this.db.sync(remoteDatabase, {
      live: true,
      retry: true
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }
}
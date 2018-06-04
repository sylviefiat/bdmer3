import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable, of, from, pipe, throwError } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';
import { MapStaticService} from '../../core/services/map-static.service';


import * as PouchDB from "pouchdb";
import { ResponsePDB } from '../../core/models/pouchdb';
import { Platform, Zone, Property, Survey, Station, ZonePreference, Count } from '../models/platform';
import { Country } from '../../countries/models/country';

@Injectable()
export class PlatformService {
  private currentPlatform: Observable<Platform>;
  private db: any;

  constructor(private mapStaticService: MapStaticService, private http: Http) {
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

  editPlatform(platform: Platform, country: Country): Observable<Platform> {
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
            return throwError('Import is not possible : country has not been defined');
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
    console.log(survey);
    if(platform.code !== survey.codePlatform)
      return throwError('Import is not possible : survey codePlatform is different from selected platform');
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
    if(platform.code !== station.codePlatform)
      return throwError('Import is not possible : station codePlatform is different from selected platform');
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

  editZonePref(platform: Platform, zonePref: ZonePreference): Observable<ZonePreference> {
    console.log(zonePref);
    if(platform.code !== zonePref.codePlatform)
      return throwError('Import is not possible : zonePref codePlatform is different from selected platform');
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
    console.log(count);
    if(platform.code !== count.codePlatform)
      return throwError('Import is not possible : count codePlatform is different from selected platform');
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
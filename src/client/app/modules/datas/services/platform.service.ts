import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { MapStaticService} from '../../core/services/map-static.service';


import * as PouchDB from "pouchdb";
import { ResponsePDB } from '../../core/models/pouchdb';
import { Platform, Zone, Property, Survey, Transect, ZonePreference, Count } from '../models/platform';
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
    return fromPromise(this.sync(remote + dbname));
  }

  public getAll(): Observable<any> {
   return fromPromise(this.db.allDocs({ include_docs: true }))
      .map((result: ResponsePDB) => 
        result.rows.map(row => row.doc)
      )
  }

  getPlatform(platformCode: string): Observable<Platform> {
    return fromPromise(this.db.query(function(doc, emit) {
      emit(doc.code);
    }, { key: platformCode, include_docs: true }))
    .map((result: ResponsePDB) => {
      return result.rows && result.rows[0] && result.rows[0].doc;
    
    })
  }

  addPlatform(platform: Platform): Observable<Platform> {
    platform._id=platform.code;
    this.currentPlatform = of(platform);
    return fromPromise(this.db.put(platform))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        console.log(response);
        return  this.currentPlatform;
      })
  }

  importPlatform(platform: Platform[]): Observable<Observable<Platform>> {
    return of(platform)
      .map((sp, i) => this.addPlatform(sp[i]))
  }

  editPlatform(platform: Platform, country: Country): Observable<Platform> {
    platform._id=platform.code;
    return this.getPlatform(platform.code)
      .mergeMap(st => {  
        if (!platform.zones) platform.zones = []; 
        if(!platform.surveys) platform.surveys = [];
        if(country !== undefined){
          platform.codeCountry = country.code;
        }
        if(platform.codeCountry === null){
          return _throw('Import is not possible : country has not been defined');
        }      
        if(st) {platform._rev = st._rev;}
        this.currentPlatform = of(platform);
        return fromPromise(this.db.put(platform));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  this.currentPlatform;
      })
  }

  removePlatform(platform: Platform): Observable<Platform> {    
    return fromPromise(this.db.remove(platform))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(platform);
      })
  }

  editZone(zone: Zone, platform: Platform): Observable<Zone> {
    var url = this.mapStaticService.googleMapUrl(zone.geometry["coordinates"])

    this.mapStaticService.staticMapToB64(url).then(function(data){
      zone.staticmap = data.toString();
    })

    return this.getPlatform(platform.code)
      .filter(platform => platform!==null)
      .mergeMap(st => {           
        if(!zone.codePlatform) zone.codePlatform=platform.code;
        if(!st.zones) st.zones = [];
        if(!zone.transects) zone.transects = [];
        if(!zone.zonePreferences) zone.zonePreferences = [];
        st.zones = [ ...st.zones.filter(z => z.properties.code !== zone.properties.code), zone];
        this.currentPlatform = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(zone);
      })
  }

  removeZone(zone: Zone): Observable<Zone> {    
    return this.getPlatform(zone.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(st => {
        st.zones = st.zones.filter(z => z.properties.code !== zone.properties.code);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        console.log(zone);
        return of(zone);
      })
  }

  editSurvey(platform: Platform, survey: Survey): Observable<Survey> {
    console.log(survey);
    if(platform.code !== survey.codePlatform)
      return _throw('Import is not possible : survey codePlatform is different from selected platform');
    return this.getPlatform(platform.code)
      .filter(platform => platform!==null)
      .mergeMap(st => { 
        if(!survey.counts) survey.counts = [];
        survey.codeCountry = st.codeCountry;
        st.surveys = [ ...st.surveys.filter(c => c.code !== survey.code), survey];     
        this.currentPlatform = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(survey);
      })
  }

  removeSurvey(survey: Survey): Observable<Survey> {    
    return this.getPlatform(survey.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(st => {
        let zn = st.zones.filter(z => z.properties.code === survey.code)[0];
        st.surveys = st.surveys.filter(c => c.code !== survey.code);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(survey);
      })
  }

  editTransect(platform: Platform, transect: Transect): Observable<Transect> {
    console.log(transect);
    if(platform.code !== transect.codePlatform)
      return _throw('Import is not possible : transect codePlatform is different from selected platform');
    return this.getPlatform(platform.code)
      .filter(platform => platform!==null)
      .mergeMap(st => {  
        let zn = st.zones.filter(z => z.properties.code === transect.codeZone)[0];
        if(zn){
          if(zn.transects.filter(t => t.code === transect.code).length > -1){
            zn.transects = [ ...zn.transects.filter(t => t.code !== transect.code), transect];
          }
          st.zones = [ ...st.zones.filter(z => z.properties.code !== zn.properties.code), zn];
        } 
        this.currentPlatform = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(transect);
      })
  }

  removeTransect(transect: Transect): Observable<Transect> {    
    return this.getPlatform(transect.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(st => {
        let zn = st.zones.filter(z => z.properties.code === transect.codeZone)[0];
        zn.transects = zn.transects.filter(t => t.code !== transect.code);
        st.zones = [...st.zones.filter(z => z.properties.code !== transect.codeZone),zn];
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(transect);
      })
  }

  editZonePref(platform: Platform, zonePref: ZonePreference): Observable<ZonePreference> {
    console.log(zonePref);
    if(platform.code !== zonePref.codePlatform)
      return _throw('Import is not possible : zonePref codePlatform is different from selected platform');
    return this.getPlatform(platform.code)
      .filter(platform => platform!==null)
      .mergeMap(st => {  
        let zn = st.zones.filter(z => z.properties.code === zonePref.codeZone)[0];
        if(zn){
          if(zn.zonePreferences.filter(zp => zp.code === zonePref.code).length > -1){
            zn.zonePreferences = [ ...zn.zonePreferences.filter(zp => zp.code !== zonePref.code), zonePref];
          }
          st.zones = [ ...st.zones.filter(z => z.properties.code !== zn.properties.code), zn];
        } 
        this.currentPlatform = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(zonePref);
      })
  }

  removeZonePref(zonePref: ZonePreference): Observable<ZonePreference> {    
    return this.getPlatform(zonePref.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(st => {
        let zn = st.zones.filter(z => z.properties.code === zonePref.codeZone)[0];
        zn.zonePreferences = zn.zonePreferences.filter(zn => zn.code !== zonePref.code);
        st.zones = [...st.zones.filter(z => z.properties  .code !== zonePref.codeZone),zn];
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(zonePref);
      })
  }

  editCount(platform: Platform, count: Count): Observable<Count> {
    console.log(count);
    if(platform.code !== count.codePlatform)
      return _throw('Import is not possible : count codePlatform is different from selected platform');
    return this.getPlatform(platform.code)
      .filter(platform => platform!==null)
      .mergeMap(st => {  
        if(!count.mesures) count.mesures = [];
        let cp = st.surveys.filter(c => c.code === count.codeSurvey)[0];
        if(cp){
          if(cp.counts.filter(c => c.code === count.code).length > -1){
            cp.counts = [ ...cp.counts.filter(c => c.code !== count.code), count];
          }
          st.surveys = [...st.surveys.filter(c => c.code != count.codeSurvey), cp];
        }  
        this.currentPlatform = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(count);
      })
  }

  removeCount(count: Count): Observable<Count> {    
    return this.getPlatform(count.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(st => {
        let ca = st.surveys.filter(c => c.code === count.codeSurvey)[0];
        ca.counts = ca.counts.filter(ct => ct.code !== count.code);
        st.surveys = [...st.surveys.filter(c => c.code !== count.codeSurvey),ca];
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(count);
      })
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
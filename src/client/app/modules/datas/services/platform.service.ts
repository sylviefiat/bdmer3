import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { MapStaticService} from '../../core/services/map-static.service';


import * as PouchDB from "pouchdb";
import { ResponsePDB } from '../../core/models/pouchdb';
import { Platform, Zone, Property, Survey, Station, ZonePreference, Count } from '../models/platform';
import { Country } from '../../countries/models/country';
import { Species } from '../../datas/models/species';

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

  importPlatformVerification(platform, countries: Country[]): Observable<string> {
    if(countries.filter(country => country.code === platform.codeCountry).length===0)
      return of('Platform '+platform.code+' cannot be inserted because country '+platform.codeCountry+' is not in the database');  
    return of(''); 
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
      .mergeMap(pt => {           
        if(!zone.codePlatform) zone.codePlatform=platform.code;
        if(!pt.zones) pt.zones = [];
        if(!pt.stations) pt.stations = [];
        if(!zone.zonePreferences) zone.zonePreferences = [];
        pt.zones = [ ...pt.zones.filter(z => z.properties.code !== zone.properties.code), zone];
        this.currentPlatform = of(pt);
        return fromPromise(this.db.put(pt));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(zone);
      })
  }

  removeZone(zone: Zone): Observable<Zone> {    
    return this.getPlatform(zone.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(pt => {
        pt.zones = pt.zones.filter(z => z.properties.code !== zone.properties.code);
        return fromPromise(this.db.put(pt));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(zone);
      })
  }

  editSurvey(platform: Platform, survey: Survey): Observable<Survey> {
    if(platform.code !== survey.codePlatform)
      return _throw('Import is not possible : survey codePlatform is different from selected platform');
    return this.getPlatform(platform.code)
      .filter(platform => platform!==null)
      .mergeMap(pt => { 
        if(!survey.counts) survey.counts = [];
        survey.codeCountry = pt.codeCountry;
        pt.surveys = [ ...pt.surveys.filter(c => c.code !== survey.code), survey];     
        this.currentPlatform = of(pt);
        return fromPromise(this.db.put(pt));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(survey);
      })
  }

  importSurveyVerification(survey: Survey, platform: Platform): Observable<string>{
    if(survey.codePlatform !== platform.code && survey.codeCountry === platform.codeCountry){
      return of('There is no platform ' + survey.codePlatform + ' for country ' + survey.codeCountry);
    }

    if(survey.codePlatform === platform.code && survey.codeCountry !== platform.codeCountry){
      return of('Platform ' + survey.codePlatform + " isn't part of country " + survey.codeCountry);
    }

    if(survey.codePlatform !== platform.code && survey.codeCountry !== platform.codeCountry){
      return of('Platform ' + survey.codePlatform + " and country " + survey.codeCountry + " are not in database");
    }

    return of('');
  }

  removeSurvey(survey: Survey): Observable<Survey> {    
    return this.getPlatform(survey.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(pt => {
        let zn = pt.zones.filter(z => z.properties.code === survey.code)[0];
        pt.surveys = pt.surveys.filter(c => c.code !== survey.code);
        return fromPromise(this.db.put(pt));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(survey);
      })
  }

  editStation(platform: Platform, station: Station): Observable<Station> {
    if(platform.code !== station.codePlatform)
      return _throw('Import is not possible : station codePlatform is different from selected platform');
    return this.getPlatform(platform.code)
      .filter(platform => platform!==null)
      .mergeMap(pt => {  
        pt.stations = [ ...pt.stations.filter(t => t.properties.code !== station.properties.code), station];         
        this.currentPlatform = of(pt);
        return fromPromise(this.db.put(pt));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(station);
      })
  }

  removeStation(station: Station): Observable<Station> {    
    return this.getPlatform(station.codePlatform)
      .filter(platform => platform!==null)
      .mergeMap(pt => {
        pt.stations = pt.stations.filter(t => t.properties.code !== station.properties.code);
        return fromPromise(this.db.put(pt));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(station);
      })
  }

  importTransectVerification(transect, platform: Platform): Observable<string>{
    if(transect.code_platform === platform.code && platform.zones.filter(zone => transect.code_zone === zone.properties.code)){
      console.log("ui")
    }

    // if(countries.filter(country => country.code === platform.codeCountry).length===0)
    //   return of('Platform '+platform.code+' cannot be inserted because country '+platform.codeCountry+' is not in the database');  
    // return of(''); 
    return of(''); 
  }


  editZonePref(platform: Platform, zonePref: ZonePreference): Observable<ZonePreference> {
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

  importZonePrefVerification(zonePref: ZonePreference, platform: Platform, species: Species[]): Observable<string>{
    if(zonePref.codePlatform === platform.code){
      for(let i = 0; i < platform.zones.length; i++){
        if(zonePref.codeZone === platform.zones[i].properties.code){
          for(let y = 0; i < species.length; y++){
            if(zonePref.codeSpecies === species[y].code){
              return of('');
            }
            if(zonePref.codeSpecies !== species[y].code && y === species.length - 1){
              return of("CodeSpecies "+zonePref.codeSpecies+" cannot be inserted because it doesn't exist in database");
            }
          }
        }
        if(zonePref.codeZone !== platform.zones[i].properties.code && i === platform.zones.length - 1){
          return of('ZonePref '+zonePref.code+' cannot be inserted because codeZone '+ zonePref.codeZone+' is not in the database');
        }
      }
    }else{
      return of('ZonePref '+zonePref.code+' cannot be inserted because codePlatform '+zonePref.codePlatform+' is not in the database');
    }

    return of('')
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

  importCountVerification(count: Count, platform: Platform, species: Species[]): Observable<string>{
    if(count.codePlatform === platform.code){
      for(let i = 0; i < platform.zones.length; i++){
        if(count.codeZone === platform.zones[i].properties.code){
          for(let x = 0; x < platform.zones[i].transects.length; x++){
            if(count.codeTransect === platform.zones[i].transects[x].properties.code){
              for(let y = 0; i < species.length; y++){
                if(count.mesures[0].codeSpecies === species[y].code){
                  for(let z = 0; z < platform.surveys.length; z++){
                    if(count.codeSurvey === platform.surveys[z].code){
                      return of('');
                    }
                    if(count.codeSurvey !== platform.surveys[i].code && z === platform.surveys.length - 1){
                      return of("CodeSurvey "+count.codeSurvey+" cannot be inserted because it doesn't exist in database for zone " + count.codeZone);
                    }
                  }
                }
                if(count.mesures[0].codeSpecies !== species[y].code && y === species.length - 1){
                  return of("CodeSpecies "+count.mesures[0].codeSpecies+" cannot be inserted because it doesn't exist in database");
                }
              }
            }
            if(count.codeTransect !== platform.zones[i].transects[x].properties.code && x === platform.zones[i].transects.length - 1){
              return of("CodeTransect "+count.codeTransect+" cannot be inserted because it doesn't exist in database for zone " + count.codeZone);
            }
          }
        }
        if(count.codeZone !== platform.zones[i].properties.code && i === platform.zones.length - 1){
          return of('Zone '+count.codeZone+ " cannot be inserted because it doesn't exist in database for platform " + count.codePlatform);
        }
      }
    }else{
      return of('Platform '+count.codePlatform+" cannot be inserted because it doesn't exist in the database");
    }

    return of('')
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
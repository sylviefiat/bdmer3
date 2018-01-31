import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';


import * as PouchDB from "pouchdb";
import { ResponsePDB } from '../../core/models/pouchdb';
import { Site, Zone, Campaign, Transect, ZonePreference, Count } from '../models/site';
import { Country } from '../../countries/models/country';

@Injectable()
export class SiteService {
  private currentSite: Observable<Site>;
  private db: any;

  constructor(private http: Http) {
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

  getSite(siteCode: string): Observable<Site> {
    return fromPromise(this.db.query(function(doc, emit) {
      emit(doc.code);
    }, { key: siteCode, include_docs: true }))
    .map((result: ResponsePDB) => {
      return result.rows && result.rows[0] && result.rows[0].doc;
    
    })
  }

  addSite(site: Site): Observable<Site> {
    site._id=site.code;
    this.currentSite = of(site);
    return fromPromise(this.db.put(site))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        console.log(response);
        return  this.currentSite;
      })
  }

  importSite(site: Site[]): Observable<Observable<Site>> {
    return of(site)
      .map((sp, i) => this.addSite(sp[i]))
  }

  editSite(site: Site, country: Country): Observable<Site> {
    console.log(site);
    site._id=site.code;
    return this.getSite(site.code)
      .mergeMap(st => {  
        if (!site.zones) site.zones = []; 
        if(country !== undefined){
          site.codeCountry = country.code;
        }
        if(site.codeCountry === null){
          return _throw('Import is not possible : country has not been defined');
        }      
        if(st) {site._rev = st._rev;}
        this.currentSite = of(site);
        return fromPromise(this.db.put(site));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  this.currentSite;
      })
  }

  removeSite(site: Site): Observable<Site> {    
    return fromPromise(this.db.remove(site))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(site);
      })
  }

  editZone(site: Site, zone: Zone): Observable<Zone> {
    console.log(zone);
    return this.getSite(site.code)
      .filter(site => site!==null)
      .mergeMap(st => {   
        if(!zone.codeSite) zone.codeSite=site.code;
        if(!st.zones) st.zones = [];
        if(!zone.transects) zone.transects = [];
        if(!zone.campaigns) zone.campaigns = [];
        if(!zone.zonePreferences) zone.zonePreferences = [];
        st.zones = [ ...st.zones.filter(z => z.code !== zone.code), zone];
        this.currentSite = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(zone);
      })
  }

  removeZone(zone: Zone): Observable<Zone> {    
    return this.getSite(zone.codeSite)
      .filter(site => site!==null)
      .mergeMap(st => {
        st.zones = st.zones.filter(z => z.code !== zone.code);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(zone);
      })
  }

  editCampaign(site: Site, campaign: Campaign): Observable<Campaign> {
    console.log(campaign);
    return this.getSite(site.code)
      .filter(site => site!==null)
      .mergeMap(st => {  
        if(!campaign.counts) campaign.counts = [];
        campaign.codeCountry = st.codeCountry;
        let zn = st.zones.filter(z => z.code === campaign.codeZone)[0];
        if(zn){
          if(zn.campaigns.filter(t => t.code === campaign.code).length > -1){
            zn.campaigns = [ ...zn.campaigns.filter(t => t.code !== campaign.code), campaign];
          }
          st.zones = [ ...st.zones.filter(z => z.code !== zn.code), zn];
        } 
        this.currentSite = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(campaign);
      })
  }

  removeCampaign(campaign: Campaign): Observable<Campaign> {    
    return this.getSite(campaign.codeSite)
      .filter(site => site!==null)
      .mergeMap(st => {
        let zn = st.zones.filter(z => z.code === campaign.codeZone)[0];
        zn.campaigns = zn.campaigns.filter(c => c.code !== campaign.code);
        st.zones = [...st.zones.filter(z => z.code !== campaign.codeZone),zn];
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(campaign);
      })
  }

  editTransect(site: Site, transect: Transect): Observable<Transect> {
    console.log(transect);
    return this.getSite(site.code)
      .filter(site => site!==null)
      .mergeMap(st => {  
        let zn = st.zones.filter(z => z.code === transect.codeZone)[0];
        if(zn){
          if(zn.transects.filter(t => t.code === transect.code).length > -1){
            zn.transects = [ ...zn.transects.filter(t => t.code !== transect.code), transect];
          }
          st.zones = [ ...st.zones.filter(z => z.code !== zn.code), zn];
        } 
        this.currentSite = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(transect);
      })
  }

  removeTransect(transect: Transect): Observable<Transect> {    
    return this.getSite(transect.codeSite)
      .filter(site => site!==null)
      .mergeMap(st => {
        let zn = st.zones.filter(z => z.code === transect.codeZone)[0];
        zn.transects = zn.transects.filter(t => t.code !== transect.code);
        st.zones = [...st.zones.filter(z => z.code !== transect.codeZone),zn];
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(transect);
      })
  }

  editZonePref(site: Site, zonePref: ZonePreference): Observable<ZonePreference> {
    console.log(zonePref);
    return this.getSite(site.code)
      .filter(site => site!==null)
      .mergeMap(st => {  
        let zn = st.zones.filter(z => z.code === zonePref.codeZone)[0];
        if(zn){
          if(zn.zonePreferences.filter(zp => zp.code === zonePref.code).length > -1){
            zn.zonePreferences = [ ...zn.zonePreferences.filter(zp => zp.code !== zonePref.code), zonePref];
          }
          st.zones = [ ...st.zones.filter(z => z.code !== zn.code), zn];
        } 
        this.currentSite = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(zonePref);
      })
  }

  removeZonePref(zonePref: ZonePreference): Observable<ZonePreference> {    
    return this.getSite(zonePref.codeSite)
      .filter(site => site!==null)
      .mergeMap(st => {
        let zn = st.zones.filter(z => z.code === zonePref.codeZone)[0];
        zn.zonePreferences = zn.zonePreferences.filter(zn => zn.code !== zonePref.code);
        st.zones = [...st.zones.filter(z => z.code !== zonePref.codeZone),zn];
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(zonePref);
      })
  }

  editCount(site: Site, count: Count): Observable<Count> {
    console.log(count);
    return this.getSite(site.code)
      .filter(site => site!==null)
      .mergeMap(st => {  
        let zn = st.zones.filter(z => z.code === count.codeZone)[0];
        if(zn){
          let cp = zn.campaigns.filter(t => t.code === count.codeCampaign)[0];
          if(cp){
            if(cp.counts.filter(c => c.code === count.code).length > -1){
              cp.counts = [ ...cp.counts.filter(c => c.code !== count.code), count];
            }
            zn.campaigns = [...zn.campaigns.filter(t => t.code != count.codeCampaign), cp];
          }          
          st.zones = [ ...st.zones.filter(z => z.code !== zn.code), zn];
        } 
        this.currentSite = of(st);
        return fromPromise(this.db.put(st));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return  of(count);
      })
  }

  removeCount(count: Count): Observable<Count> {    
    return this.getSite(count.codeSite)
      .filter(site => site!==null)
      .mergeMap(st => {
        let zn = st.zones.filter(z => z.code === count.codeZone)[0];
        let ca = zn.campaigns.filter(c => c.code === count.codeCampaign)[0];
        ca.counts = ca.counts.filter(ct => ct.code !== count.code);
        zn.campaigns = [...zn.campaigns.filter(c => c.code !== count.codeCampaign),ca];
        st.zones = [...st.zones.filter(z => z.code !== count.codeZone),zn];
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
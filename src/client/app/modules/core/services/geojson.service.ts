import { Injectable } from '@angular/core';
import * as togeojson from '@mapbox/togeojson';
import * as area from '@mapbox/geojson-area';
import { mergeMap } from 'rxjs/operators';

import { NameRefactorService } from './nameRefactor.service';
import { Platform } from '../../datas/models/platform';
import { Observable, from, of } from 'rxjs';

@Injectable()
export class GeojsonService {
  constructor(private nameRefactorService: NameRefactorService) { }

  kmlToGeoJson(kml, platform) {
    const self = this;
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.readAsText(kml);

      reader.onload = function(event) {
        const parser = new DOMParser();
        const x = parser.parseFromString((<string>reader.result), 'application/xml');
        console.log(kml);        
        const geojson = self.toCamel(togeojson.kml(x).features);
        console.log(geojson);
        for (let i in geojson) {
          delete geojson[i].properties['styleHash'];
          delete geojson[i].properties['styleMapHash'];
          delete geojson[i].properties['styleUrl'];
          let name = geojson[i].properties.name ? geojson[i].properties.name : (geojson[i].properties.Name ? geojson[i].properties.Name : (geojson[i].properties.id ? geojson[i].properties.id : i));
          geojson[i].properties.code =
            platform.code +
            '_' +
            self.nameRefactorService
              .convertAccent(name)
              .split(' ')
              .join('-')
              .replace(/[^a-zA-Z0-9]/g, '');

          const surface = area.geometry(geojson[i].geometry);

          geojson[i].properties.surface = parseInt(surface.toString().split('.')['0']);
        }
        console.log(geojson);
        resolve(geojson);
      };
    });
  }

  toCamel(o) {
    const self = this;
    var newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map(function(value) {
        if (typeof value === 'object') {
          value = self.toCamel(value);
        }
        return value;
      })
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
          value = o[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = self.toCamel(value);
          }
          newO[newKey] = value;
        }
      }
    }
    return newO;
  }

  /*kml2(kml, platform): Observable<any> {
    return Observable.create(observable => 
      this.kmlToGeoJson(kml,platform)
    )
      .pipe(
        mergeMap((data,index) => {
          console.log(data);
          return of(data).toArray();
      })
    );
  }*/

}


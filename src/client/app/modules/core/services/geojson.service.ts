import { Injectable } from '@angular/core';
import * as togeojson from '@mapbox/togeojson';
import * as area from '@mapbox/geojson-area';

import { NameRefactorService } from './nameRefactor.service'
import { Platform } from '../../datas/models/platform';

@Injectable()
export class GeojsonService {

      constructor(private nameRefactorService: NameRefactorService){}

      kmlToGeoJson(kml, platform){

            const self = this;
            
            return new Promise(function(resolve, reject) {
                  const reader = new FileReader();
                  reader.readAsText(kml);


                  reader.onload = function(event) {
                        const parser = new DOMParser();
                        const x = parser.parseFromString(reader.result, 'application/xml')
                        const geojson = togeojson.kml(x).features;

                        for(let i  in geojson){
                              delete geojson[i].properties['styleHash'];
                              delete geojson[i].properties['styleMapHash'];
                              delete geojson[i].properties['styleUrl'];

                              geojson[i].properties.code = platform.code+"_"+self.nameRefactorService.convertAccent(geojson[i].properties.name).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,'');

                              const surface = area.geometry(geojson[i].geometry);

                              geojson[i].properties.surface = parseInt(surface.toString().split('.')['0']);
                        }

                        resolve(geojson);
                  }
            });
      }
}
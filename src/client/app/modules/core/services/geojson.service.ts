import { Injectable } from "@angular/core";
import * as togeojson from "@mapbox/togeojson";
import * as area from "@mapbox/geojson-area";
import { mergeMap } from "rxjs/operators";

import { NameRefactorService } from "./nameRefactor.service";
import { Platform } from "../../datas/models/platform";
import { Observable, from, of } from "rxjs";

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
        const x = parser.parseFromString((<string>reader.result), "application/xml");
        const geojson = togeojson.kml(x).features;
        for (let i in geojson) {
          delete geojson[i].properties["styleHash"];
          delete geojson[i].properties["styleMapHash"];
          delete geojson[i].properties["styleUrl"];
          let name = geojson[i].properties.name ? geojson[i].properties.name : (geojson[i].properties.Name ? geojson[i].properties.Name : i);
          geojson[i].properties.code =
            platform.code +
            "_" +
            self.nameRefactorService
              .convertAccent(name)
              .split(" ")
              .join("-")
              .replace(/[^a-zA-Z0-9]/g, "");

          const surface = area.geometry(geojson[i].geometry);

          geojson[i].properties.surface = parseInt(surface.toString().split(".")["0"]);
        }
        resolve(geojson);
      };
    });
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


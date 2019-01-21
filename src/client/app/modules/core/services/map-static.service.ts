import { Injectable } from '@angular/core';
import { NameRefactorService } from './nameRefactor.service';

import * as area from '@mapbox/geojson-area';
import * as Turf from '@turf/turf';
import * as togeojson from '@mapbox/togeojson';
import * as mbxClient from '@mapbox/mapbox-sdk';

@Injectable()
export class MapStaticService {
  constructor(private nameRefactorService: NameRefactorService) {}

  refactorCoordinates(coordinates) {
    var string = coordinates.split(' ');

    while (string[string.length - 1] == '') {
      string.splice(string.length - 1, 1);
    }

    var a = string.length;

    for (var i = 0; i < a; i++) {
      if (
        parseFloat(string[i].split(',')['0']) < -180 ||
        parseFloat(string[i].split(',')['0']) > 180 ||
        parseFloat(string[i].split(',')['1']) < -90 ||
        parseFloat(string[i].split(',')['1']) > 90
      ) {
        return 'error';
      }
    }

    var ar = [];
    for (var i = 0; i < a; i++) {
      var tempo = string[i].split(",");
      for (var j = 0; j < tempo.length; j++) {
        tempo[j] = parseFloat(tempo[j]);
      }
      ar.push(tempo);
    }

    var res = [];
    res.push(ar);

    try {
      Turf.polygon(res);
    } catch (error) {
      return 'error';
    }

    return res;
  }

  checkIsValidCoordinate(coord, type) {
    let isValid;

    switch (type) {
      case 'lat':
        isValid = coord <= 90 && coord >= -90;
        break;
      case 'lng':
        isValid = coord <= 180 && coord >= -180;
        break;
    }

    return isValid;
  }

  googleMapUrl(ar) {
    var a = ar.length;
    ar = ar['0'];

    var url = 'https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff%7Cweight:5%7C';

    for (var i = 0; i < ar.length; i++) {
      url += ar[i]['1'] + ',' + ar[i]['0'];
      if (i !== ar.length - 1) {
        url += '|';
      }
    }

    url += '&size=700x700&zoom=9&key=AIzaSyCOm1K8tIc7J9GpKEjCKp4VnCwVukqic2g';

    return url;
  }

  googleMapUrlPoint(ar) {
    var a = ar.length;
    var url = 'https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff%7Cweight:5%7C';
    url += ar['1'] + ',' + ar['0'] + '&markers=color:green%7Clabel:T%7C' + ar['1'] + ',' + ar['0'];
    url += '&size=700x700&zoom=9&key=AIzaSyCOm1K8tIc7J9GpKEjCKp4VnCwVukqic2g';
    return url;
  }

  setAllStaticMapToB64(platform, zone) {
    let token = 'pk.eyJ1Ijoic3lsdmllZmlhdCIsImEiOiJjamk1MnZieGMwMTUxM3FxbDRhb2o5dDc3In0.V8jhcEcPBkyugxnw5gj2uw';
    const baseClient = mbxClient({ accessToken: token });
    delete zone['codePlatform'];
    delete zone['codePlatform'];
    delete zone['staticmap'];
    delete zone['stations'];
    delete zone['zonePreferences'];

    let geoJson = {
      type: 'FeatureCollection',
      features: []
    };

    console.log(platform);

    for (let zn of platform.zones) {
      console.log(zn);
      delete zn['codePlatform'];
      delete zn['codePlatform'];
      delete zn['staticmap'];
      delete zn['stations'];
      delete zn['zonePreferences'];
      geoJson.features.push(zn);
    }

    geoJson.features.push(zone);

    console.log(geoJson);
    // baseClient.static
    //   .getStaticImage({
    //     ownerId: "mapbox",
    //     styleId: "streets-v10",
    //     width: 200,
    //     height: 300,
    //     coordinates: [55.3097329350996, -4.523781196019549],
    //     zoom: 8,
    //     overlays: [
    //       {
    //         geoJson
    //       }
    //     ]
    //   })
    //   .send()
    //   .then(response => {
    //     console.log(response);
    //     const image = response.body;
    //     var blob = new Blob([image], { type: "image/png" });
    //     console.log(blob);
    //     var reader = new FileReader();
    //     reader.readAsDataURL(blob);
    //     reader.onloadend = function() {
    //       let base64data = reader.result;
    //       console.log(base64data);
    //     };
    //     console.log("data:image/png;base64," + window.btoa(image));
    //   });

    const request = baseClient.static.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      coordinates: [55.3097329350996, -4.523781196019549],
      zoom: 8,
      overlays: [
        {
          geoJson
        }
      ]
    });

    const staticImageUrl = request.url();
    console.log(staticImageUrl + '?access_token=pk.eyJ1Ijoic3lsdmllZmlhdCIsImEiOiJjamk1MnZieGMwMTUxM3FxbDRhb2o5dDc3In0.V8jhcEcPBkyugxnw5gj2uw');

    // var img = new Image();
    // img.src = staticImageUrl + "?access_token=" + token;
    // var xhr = new XMLHttpRequest();
    // var self = this;
    // xhr.onload = function() {
    //   var reader = new FileReader();
    //   reader.onloadend = function() {
    //     console.log(reader.result);
    //   };
    //   reader.readAsDataURL(xhr.response);
    // };
    // xhr.open("GET", staticImageUrl + "?access_token=" + token);
    // xhr.responseType = "blob";
    // xhr.send();

    // let base = "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/";
    // let token = "/1280x1280?access_token=pk.eyJ1Ijoic3lsdmllZmlhdCIsImEiOiJjamk1MnZieGMwMTUxM3FxbDRhb2o5dDc3In0.V8jhcEcPBkyugxnw5gj2uw";
    // for (let z of platform.zones) {
    //   if (zone.properties.code === z.properties.code) {
    //     z = zone;
    //     break;
    //   }
    //
    //   if (z === platform.zones[platform.zones.length - 1]) {
    //     platform.zones.push(zone);
    //   }
    // }
    //
    // console.log(platform);
    // return new Promise((resolve, reject) => {
    //   var img = new Image();
    //   img.src = staticImageUrl;
    //
    //   var xhr = new XMLHttpRequest();
    //   var self = this;
    //   xhr.onload = function() {
    //     var reader = new FileReader();
    //     reader.onloadend = function() {
    //       console.log(reader.result);
    //       resolve(reader.result);
    //     };
    //     reader.readAsDataURL(xhr.response);
    //   };
    //   xhr.open("GET", staticImageUrl);
    //   xhr.responseType = "blob";
    //   xhr.send();
    // });
  }

  setSurface(geometry) {
    var surface = area.geometry(geometry);
    return parseInt(surface.toString().split('.')['0']);
  }
}

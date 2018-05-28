import * as area from '@mapbox/geojson-area';

export class MapStaticService {

  refactorCoordinates(coordinates){
    var string = coordinates.split(' ');

    while(string[string.length - 1] == ""){
      string.splice(string.length - 1, 1)
    } 

    var a = string.length; 

    for(var i = 0; i < a; i++){
      if(parseFloat(string[i].split(',')["0"]) < -90 || parseFloat(string[i].split(',')["0"]) > 90 || parseFloat(string[i].split(',')["1"]) < -180 || parseFloat(string[i].split(',')["1"]) > 180){
        return "error"
      }
    }

    var ar = [];
    for (var i = 0; i < a; i++) {
      var tempo = string[i].split(',')
      for(var j = 0; j < tempo.length; j++){
        tempo[j] = parseFloat(tempo[j])
      }
      ar.push(tempo)
    }
    var res = [];
    res.push(ar)

    return res;
  }

  checkIsValidCoordinate(coord, type){
    let isValid;
    
    switch (type) {
      case 'lat':
      isValid = (coord <= 90 && coord >= -90);
      break;
      case 'lng':
      isValid = (coord <= 180 && coord >= -180);
      break;
    }

    return isValid;
  }

  googleMapUrl(ar){
    var a = ar.length; 
    ar = ar["0"]

    var url = "https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff%7Cweight:5%7C";

    for(var i=0; i<ar.length; i++){
      url += ar[i]["1"] + "," + ar[i]["0"]; 
      if(i !== ar.length - 1){
        url+="|"
      }
    }

    url += "&size=700x700&zoom=9&key=AIzaSyCOm1K8tIc7J9GpKEjCKp4VnCwVukqic2g"

    return url;
  }

  googleMapUrlPoint(ar){
    var a = ar.length; 
    var url = "https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff%7Cweight:5%7C";
    url += ar["1"] + "," + ar["0"] + "&markers=color:green%7Clabel:T%7C"+ ar["1"]+"," + ar["0"]; 
    url += "&size=700x700&zoom=9&key=AIzaSyCOm1K8tIc7J9GpKEjCKp4VnCwVukqic2g"
    return url;
  }

  staticMapToB64(url){
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.src = url;

      var xhr = new XMLHttpRequest();
      var self= this;
      xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  setSurface(geometry){
    var surface = area.geometry(geometry);
    return parseInt(surface.toString().split('.')['0']);
  }
}

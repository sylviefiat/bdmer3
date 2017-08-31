import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

@Component({
  selector: 'ang-map',
  styles: [`
    agm-map {
      height: 300px;
      width: 800px;
    }
  `],
  template: `
  <h1>{{ title }}</h1>
  <agm-map [latitude]="lat" [longitude]="lng">
    <agm-marker [latitude]="lat" [longitude]="lng"></agm-marker>
  </agm-map>
  <img src="https://maps.googleapis.com/maps/api/staticmap?center=47.5952,-122.3316&zoom=16&size=640x400&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&key=AIzaSyCOm1K8tIc7J9GpKEjCKp4VnCwVukqic2g"/>
  `
})
export class MapComponent {
  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;
}
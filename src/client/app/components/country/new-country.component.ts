import { Component, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormControl } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { defer, Observable, pipe, of } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { mergeMap, tap } from "rxjs/operators";

import { IAppState, getCountryList, getCountryListDetails, getCountriesIdsInApp } from "../../modules/ngrx/index";

import { CountriesAction } from "../../modules/countries/actions/index";
import { Country } from "../../modules/countries/models/country";

@Component({
  moduleId: module.id,
  selector: "bc-new-country-form",
  templateUrl: "new-country.component.html",
  styleUrls: ["new-country.component.css"]
})
export class NewCountryComponent {
  public image: any;
  results: any[];
  @Input() errorMessage: string | null;
  @Input() countryList: any[] | null;
  @Input() countryListDetails: any[] | null;
  @Input() countriesIds: any[] | null;

  @Output() submitted = new EventEmitter<Country>();

  details : any = null;
  selected : boolean = false;

  form: FormGroup = new FormGroup({
    pays: new FormControl(""),
    flag: new FormControl(""),
    province: new FormControl(""),
    coordinates: new FormGroup({
      lat: new FormControl(),
      lng: new FormControl()
    })
  });

  constructor(private http: HttpClient, private store: Store<IAppState>, private sanitizer: DomSanitizer) {}

  check(event){
    this.form.get("province").reset();
    this.selected = true;
    this.details = this.countryListDetails.filter(country => country.codeCountry === event.value.code)[0] === undefined ? null : this.countryListDetails.filter(country => country.codeCountry === event.value.code)[0];
  }

  svgToB64() {
    const url = "../node_modules/svg-country-flags/svg/" + this.form.value.pays.code.toLowerCase() + ".svg";
    return new Promise(resolve => {
      var ajax = new XMLHttpRequest();
      ajax.open("GET", url, true);
      ajax.send();
      ajax.onload = () => resolve("data:image/svg+xml;base64," + window.btoa(ajax.responseText));
    });
  }

  submit() {
    if (this.form.valid) {
      this.svgToB64().then(data => {
        if (this.form.get("province").value !== null) {
          this.form.get("pays").value["code"] = this.form.get("province").value["codeCountry"];
          this.form.get("pays").value["name"] = this.form.get("province").value["name"];
        }

        this.http
          .get(
            "http://maps.googleapis.com/maps/api/geocode/json?address=" +
              this.form.controls.pays.value["name"] +
              "&sensor=false&apiKey=AIzaSyBSEMJ07KVIWdyD0uTKaO75UYsIMMCi69w"
          )
          .subscribe(coord => {
            this.form.controls.coordinates.get("lat").setValue(coord["results"]["0"].geometry.location.lat);
            this.form.controls.coordinates.get("lng").setValue(coord["results"]["0"].geometry.location.lng);

            this.form.controls.flag.setValue(data);

            this.submitted.emit(this.form.value);
          });
      });
    }
  }

  get flag() {
    return this.form.get("pays") && this.form.get("pays").value && this.form.get("pays").value["flag"];
  }

  get pays() {
    return this.form.get("pays").value["code"];
  }

  get province() {
    return this.form.get("province").value;
  }
}

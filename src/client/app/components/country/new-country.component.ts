import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormGroup, FormControl } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { defer, Observable, pipe, of } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { mergeMap, tap } from "rxjs/operators";
import { IAppState, getCountryList, getCountryListDetails, getCountriesIdsInApp } from "../../modules/ngrx/index";
import { CountryListService } from "../../modules/countries/services/country-list.service";
import { CountriesAction } from "../../modules/countries/actions/index";
import { Country } from "../../modules/countries/models/country";

@Component({
  moduleId: module.id,
  selector: "bc-new-country-form",
  templateUrl: "new-country.component.html",
  styleUrls: ["new-country.component.css"]
})
export class NewCountryComponent implements OnInit {
  public image: any;
  results: any[];
  @Input() errorMessage: string | null;
  @Input() countryList: any[] | null;
  @Input() countryListDetails: any[] | null;
  @Input() countriesIds: any[] | null;
  @Input() platformTypeList: any[] | null;

  @Output() submitted = new EventEmitter<Country>();

  details : any = null;
  selected : boolean = false;

  form: FormGroup = new FormGroup({
    pays: new FormControl(""),
    flag: new FormControl(""),
    province: new FormControl(""),
    platformType: new FormControl(""),
    coordinates: new FormGroup({
      lat: new FormControl(),
      lng: new FormControl()
    })
  });

  constructor(
    private countryListService: CountryListService,
    private http: HttpClient,
    private store: Store<IAppState>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(){
  }

  check(event){
    this.form.get("province").reset();
    this.selected = true;
    this.details = this.countryListDetails.filter(country => country.codeCountry === event.value.code)[0] === undefined ? null : this.countryListDetails.filter(country => country.codeCountry === event.value.code)[0];
  }

  svgToB64() {
    const url = "assets/svg/" + this.form.value.pays.code.toLowerCase() + ".svg";
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
            "http://geocode.xyz/" +
              this.form.controls.pays.value["name"] +
              "?geojson=1", {responseType: 'text'}
          )
          .subscribe((str:any) => {
            console.log(str);
            let latt = str.substr(str.indexOf('<latt>')+6, str.indexOf('</latt>')-str.indexOf('<latt>')-6);
            console.log(latt);
            console.log(this.form.controls.coordinates);
            this.form.controls.coordinates.get("lat").setValue(latt);
            let longt = str.substr(str.indexOf('<longt>')+7, str.indexOf('</longt>')-str.indexOf('<longt>')-7);
            console.log(longt);
            this.form.controls.coordinates.get("lng").setValue(longt);

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

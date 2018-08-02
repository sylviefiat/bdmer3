import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { RouterExtensions, Config } from "../../modules/core/index";
import { MapStaticService } from "../../modules/core/services/map-static.service";
import { NameRefactorService } from "../../modules/core/services/nameRefactor.service";
import { IAppState, getSpeciesInApp } from "../../modules/ngrx/index";

import { Platform, Station, Count } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "bc-station-form",
    templateUrl: "station-form.component.html",
    styleUrls: ["station-form.component.css"]
})
export class StationFormComponent implements OnInit {
    @Input() platform: Platform | null;
    @Input() station: Station | null;
    @Input() countries: Country[] | null;
    @Input() errorMessage: boolean;

    @Output() submitted = new EventEmitter<Station>();

    url: string;
    code: string;
    longitude: any;
    latitude: any;
    errorLat: boolean;
    errorLng: boolean;
    newStation: number[];
    stationValid: boolean;

    stationForm: FormGroup = new FormGroup({
        type: new FormControl("Feature"),
        geometry: new FormGroup({
            type: new FormControl("Point"),
            coordinates: new FormControl()
        }),
        properties: new FormGroup({
            name: new FormControl(""),
            code: new FormControl("")
        }),
        staticMapStation: new FormControl(""),
        codePlatform: new FormControl("")
    });

    constructor(
        private nameRefactorService: NameRefactorService,
        private mapStaticService: MapStaticService,
        private store: Store<IAppState>,
        public routerext: RouterExtensions,
        private _fb: FormBuilder
    ) { }

    ngOnInit() {
        this.stationForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);

        if (this.station) {
            this.stationForm.controls.properties.get("name").setValue(this.station.properties.name);
            this.stationForm.controls.properties.get("code").setValue(this.station.properties.code);
            this.url = this.station.staticMapStation;
            this.longitude = this.station.geometry["coordinates"]["0"];
            this.latitude = this.station.geometry["coordinates"]["1"];
            this.stationForm.controls.properties.get("name").disable();

        }
    }

    submit() {
        if (!this.errorLat && !this.errorLng) {
            this.stationForm.controls.properties.get("code").setValue(
                this.platform.code +
                "_" +
                this.nameRefactorService
                    .convertAccent(this.stationForm.controls.properties.get("name").value)
                    .split(" ")
                    .join("-")
                    .replace(/[^a-zA-Z0-9]/g, "")
            );
            this.stationForm.controls.geometry.get("coordinates").setValue([this.longitude, this.latitude]);

            if (this.stationForm.valid) {
                this.stationForm.controls.properties.get("name").enable();
                this.submitted.emit(this.stationForm.value);
            }
        }
    }

    return() {
        let redirect = this.station ? "station/" + this.platform.code + "/" + this.station.properties.code : "/platform/" + this.platform.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: "slideTop"
            }
        });
    }

    isStationValid(valid) {
        this.stationValid = valid;
    }

    coordChange() {
        this.errorLat = false;
        this.errorLng = false;

        if (this.latitude) {
            this.errorLat = !this.mapStaticService.checkIsValidCoordinate(this.latitude, 'lat');
        }

        if (this.longitude) {
            this.errorLng = !this.mapStaticService.checkIsValidCoordinate(this.longitude, 'lng');
        }

        if (!this.errorLat && !this.errorLng && this.latitude && this.longitude) {
            this.newStation = [this.longitude, this.latitude];
        } else {
            this.url = ""
        }

    }
}

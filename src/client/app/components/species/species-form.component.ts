import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { SpeciesAction } from '../../modules/datas/actions/index';
import { Species, NameI18N } from '../../modules/datas/models/species';
import { Country } from '../../modules/countries/models/country';

@Component({
    moduleId: module.id,
    //changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-species-form',
    templateUrl: 'species-form.component.html',
    styleUrls: [
        'species-form.component.css',
    ],
})
export class SpeciesFormComponent implements OnInit {

    @Input() errorMessage: string | null;
    @Input() species: Species | null;
    @Input() countries: Country[];
    @Input() alreadySetCountries$: Observable<string[]>;
    url = '';

    @Output() submitted = new EventEmitter<Species>();

    form: FormGroup = new FormGroup({
        code: new FormControl(this.species && this.species.code, Validators.required),
        scientificName: new FormControl(this.species && this.species.scientificName, Validators.required),
        names: this._fb.array([]),
        picture: new FormControl(''),
        LLW: this._fb.group({
            coefA: new FormControl(this.species && this.species && this.species.LLW.coefA),
            coefB: new FormControl(this.species && this.species.LLW.coefB),
        }),
        LW: this._fb.group({
            coefA: new FormControl(this.species && this.species.LW.coefA),
            coefB: new FormControl(this.species && this.species.LW.coefB),
        }),
        conversions: this._fb.group({
            salt: new FormControl(this.species && this.species.conversions.salt),
            BDM: new FormControl(this.species && this.species.conversions.BDM),
        }),
        biologicDimensions: this._fb.group({
            longMax: new FormControl(this.species && this.species.biologicDimensions.longMax),
            largMax: new FormControl(this.species && this.species.biologicDimensions.largMax),
        }),
        distribution: new FormControl(this.species && this.species.distribution),
        habitatPreference: new FormControl(this.species && this.species.habitatPreference),
        legalDimensions: this._fb.array([]),
    });

    constructor(private cdr: ChangeDetectorRef, private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    initName() {
        if (this.species && this.species.names && this.species.names.length > 0) {
            const control = <FormArray>this.form.controls['names'];
            let addrCtrl;
            for (let name of this.species.names) {
                addrCtrl = this.newName(name.lang, name.name);
                control.push(addrCtrl);
            }
        } else {
            return this.addName();
        }
    }

    initLegalDim() {
        if (this.species && this.species.legalDimensions && this.species.legalDimensions.length > 0) {
            const control = <FormArray>this.form.controls['legalDimensions'];
            let addrCtrl;
            for (let dims of this.species.legalDimensions) {
                addrCtrl = this.newLegalDim(dims.codeCountry, dims.longMin, dims.longMax);
                control.push(addrCtrl);
            }
        } else {
            return this.addLegalDim();
        }
    }

    ngOnInit() {
        
        if (this.species) {
            this.form.controls.code.setValue(this.species.code);
            this.form.controls.picture.setValue(this.species.picture);
            this.url = this.species.picture;

            this.form.controls.scientificName.setValue(this.species.scientificName);

            this.form.patchValue({ LLW: { coefA: this.species.LLW.coefA } });
            this.form.patchValue({ LLW: { coefB: this.species.LLW.coefB } });

            this.form.patchValue({ LW: { coefA: this.species.LLW.coefA } });
            this.form.patchValue({ LW: { coefB: this.species.LLW.coefB } });

            this.form.patchValue({ conversions: { salt: this.species.conversions.salt } });
            this.form.patchValue({ conversions: { BDM: this.species.conversions.BDM } });

            this.form.patchValue({ biologicDimensions: { longMax: this.species.biologicDimensions.longMax } });
            this.form.patchValue({ biologicDimensions: { largMax: this.species.biologicDimensions.largMax } });

            this.form.controls.distribution.setValue(this.species.distribution);
            this.form.controls.habitatPreference.setValue(this.species.habitatPreference);
            let alreadySetCountries: string[] = [];
            for(let dims of this.species.legalDimensions){
                alreadySetCountries.push(dims.codeCountry);
            }
            this.alreadySetCountries$ = of(alreadySetCountries);
        }
        this.initName();
        this.initLegalDim();
        this.cdr.detectChanges();
    }

    get picture() {
     return (
           this.form.get('picture').value
         )
       }

    newName(lang, name) {
        return this._fb.group({
            lang: new FormControl(lang),
            name: new FormControl(name)
        });
    }

    addName() {
        const control = <FormArray>this.form.controls['names'];
        const addrCtrl = this.newName('', '');

        control.push(addrCtrl);
        this.cdr.detectChanges();
    }

    resizeImage (settings) {
        var file = settings.file;
        var maxSize = settings.maxSize;
        var reader = new FileReader();
        var image = new Image();
        var canvas = document.createElement('canvas');
        var dataURItoBlob = function (dataURI) {
            var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                atob(dataURI.split(',')[1]) :
                unescape(dataURI.split(',')[1]);
            var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var max = bytes.length;
            var ia = new Uint8Array(max);
            for (var i = 0; i < max; i++)
                ia[i] = bytes.charCodeAt(i);
            return new Blob([ia], { type: mime });
        };
        var resize = function () {
            var width = image.width;
            var height = image.height;
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            var dataUrl = canvas.toDataURL('image/jpeg');
            return dataURItoBlob(dataUrl);
        };
        return new Promise(function (resolve) {
            reader.onload = function (readerEvent:any) {
                image.onload = function () { return resolve(resize()); };
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    imgToB64(pic){
        return new Promise((resolve, reject) => {
            if(pic.size > 512000){
                this.resizeImage({
                    file: pic,
                    maxSize: 500
                }).then(function (resizedImage) {
                    pic=resizedImage

                    const reader = new FileReader();
                    reader.readAsDataURL(pic);

                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                })
            }else{
                const reader = new FileReader();
                reader.readAsDataURL(pic);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            }
          });
    }

    showPic(event:any){
            var reader = new FileReader();


              reader.onload = (event: any) => { // called once readAsDataURL is completed
                this.url = event.target.result;
            }
              reader.readAsDataURL(event.target.files[0]); // read file as data url
    }

    addPicture(event:any){
        if (event.target.files && event.target.files[0]){
            this.showPic(event)
            const file = event.srcElement.files["0"];
            
            this.imgToB64(file).then((data) => {
                this.form.controls.picture.setValue(data);
            })
        }
    }    

    removeName(i: number) {
        const control = <FormArray>this.form.controls['names'];
        control.removeAt(i);
    }

    newLegalDim(code, min, max) {
        return this._fb.group({
            codeCountry: new FormControl(code),
            longMin: new FormControl(min),
            longMax: new FormControl(max),
        });
    }

    addLegalDim() {
        const control = <FormArray>this.form.controls['legalDimensions'];
        const addrCtrl = this.newLegalDim('', '', '');
        control.push(addrCtrl);
        this.cdr.detectChanges();
    }

    removeLegalDim(i: number) {
        const control = <FormArray>this.form.controls['legalDimensions'];
        control.removeAt(i);
    }

    echangeCountry(codes: string[]){
        this.alreadySetCountries$ = this.alreadySetCountries$.map(countries => [...countries.filter(code => code!==codes[0] && code!==codes[1]),codes[1]]);
    }

    submit() {
        if (this.form.valid) {

            // const control = <FormArray>this.form.controls['picture'];



            // const code = control.code.value;

            // const picture = control.picture.value;
            // const blob = picture.slice(0, -1); 
            // const typeImg = picture.type;
            // const name = code + "." + picture.name.split(".")[1]
            // const newPic = new File([blob], name, {type: typeImg});
            
            // console.log(newPic);
            
            // control.picture.patchValue(newPic);
            
            console.log(this.form.value)
            this.submitted.emit(this.form.value);

        }
    }

    return() {
        this.routerext.navigate(['/species/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}
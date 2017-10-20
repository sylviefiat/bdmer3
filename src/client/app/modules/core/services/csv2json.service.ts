import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';

@Injectable()
export class Csv2JsonService {

    constructor(private papa: PapaParseService) {

    }

    private extractData(data) { // Input csv data to the function

    let csvData = data;
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    let lines = [];

    for ( let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            let tarr = [];
            for ( let j = 0; j < headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
    console.log(lines); //The data in the form of 2 dimensional array.
  }

    csv2Species(csv: any): any{
        let csvData = 'code;scientific_name;sp_nom;sp_name;LLW_coef_a;LLW_coef_b;LW_coef_a;LW_coef_b;conversion_salt;conversion_BDM;long_max;larg_max;distribution;habitat_preference;L_min_NC;L_min_vanuatu;L_min_PNG;L_min_salomon;L_min_fiji;L_min_tonga;L_min_nd'+
'a_echinites;Actinopyga echinites;Holothurie brune;Deepwater redfish;0.001320729;1.38;0.000342;2.6;0.5;0.1;360;100;restrict;Coastal reefs, in rubble, seagrass beds, or sand between corals. Depth: 0?3 m.;0;0;0;0;0;0;170'+
'a_mauritiana;Actinopyga mauritiana;Holothurie des brisants;Surf redfish;0.019643443;1.11;0.000647;2.456;0.5;0.06;380;150;restrict;Oceanic-influenced reefs in wave-exposed zones. Depth: 0?10 m.;0;0;0;0;0;0;130'+
'a_miliaris;Actinopyga miliaris;Holothurie noire (papaye);Hairy blackfish;0.100768051;0.93;0.000824;2.441;0.5;0.1;300;150;restrict;Sandy lagoons and reef flats. Depth: 1?10 m, but mostly less than 4 m.;0;0;0;0;0;0;140';
        this.papa.parse(csvData,{
            complete: (results, file) => {
                console.log('Parsed: ', results, file);
            }
        });
    }
}
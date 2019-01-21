import { Injector, Component } from '@angular/core';
import { Config } from '../../modules/core/index';
import { Store } from '@ngrx/store';
import { IAppState, getLangues } from '../../modules/ngrx/index';

import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
    moduleId: module.id,
    selector: 'sd-about',
    templateUrl: 'about.component.html',
    styleUrls: [
        'about.component.css',
    ],
})
export class AboutComponent {

    pn_img = 'logo_province_nord.jpg';
    vfd_img = 'logo_vfd.jpg';
    ird_img = 'logo_ird.png';
    sfa_img = 'logo_sfa.png';
    siteEntropie = 'http://umr-entropie.ird.nc';
    mailLeopold = 'marc.leopold@ird.fr';
    private pdfFile: string;
    private docs_repo: string;
    private imgs_repo: string;

    constructor(private injector: Injector, private store: Store<IAppState>) {
        this.docs_repo = '../../../assets/files/';
        this.imgs_repo = '../../../assets/img/';

        this.store.select(getLangues).subscribe(lang => {
            switch (lang) {
                case "fr": {
                    this.pdfFile = 'BDMer2.0_Guide_de_l_utilisateur_Juin_2014.pdf';
                    break;
                }
                case "en":
                default:
                    this.pdfFile = 'BDMer2.0_Guide_de_l_utilisateur_Juin_2014.pdf';
            }
        });
    }

    get logo_pn() {
        return this.imgs_repo + this.pn_img;
    }

    get logo_vfd() {
        return this.imgs_repo + this.vfd_img;
    }

    get logo_ird() {
        return this.imgs_repo + this.ird_img;
    }

    get logo_sfa() {
        return this.imgs_repo + this.sfa_img;
    }

    getPdfUrl() {
        let wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} };
        wb.SheetNames.push("test");
        wb.Sheets["test"] = XLSX.utils.json_to_sheet([{ test: 'kcheoc' }]);
        const wbout = XLSX.write(wb, {
            bookType: 'xlsx', bookSST: true, type:
                'binary'
        });
        console.log("test");
        let blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' });
        saveAs(blob, 'test.xls');
        //return this.docs_repo + this.pdfFile;
    }

    s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        };
        return buf;
    }
}

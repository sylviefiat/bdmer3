import { Injector, Component } from '@angular/core';
import { Config } from '../../modules/core/index';
import { Store } from '@ngrx/store';
import { IAppState } from '../../modules/ngrx/index';

@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: [
    'about.component.css',
  ],
})
export class AboutComponent {

  private pdfFile: string;
  private docs_repo: string;

  constructor(private injector: Injector, private store: Store<IAppState>) {
    this.store.take(1).subscribe((s: any) => {
      this.docs_repo = "../../../assets/files/";
      
      switch (s.i18n.lang) {
        case "fr": {
          this.pdfFile="BDMer2.0_Guide_de_l_utilisateur_Juin_2014.pdf";
          break;
        }
        case "en":
        default:
           this.pdfFile="BDMer2.0_Guide_de_l_utilisateur_Juin_2014.pdf";
      }
      
    });
    //console.log(this.pdfFile);
  }

  getPdf(){    
    return this.pdfFile;
  }

  getPdfUrl(){    
    return this.docs_repo+this.pdfFile;
  }
}

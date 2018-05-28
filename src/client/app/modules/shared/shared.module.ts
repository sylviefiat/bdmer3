import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule, MatCardModule, MatInputModule, MatListModule, MatSelectModule, MatOptionModule, MatRadioModule, MatChipsModule, MatDatepickerModule, 
  MatNativeDateModule, MatCheckboxModule, MatExpansionModule,MatStepperModule,MatTabsModule, MatSidenavModule } from '@angular/material';
  
/*import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';*/
//import {CdkTableModule} from '@angular/cdk/table';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { MomentModule } from 'angular2-moment';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
// modules
import { SHARED_COMPONENTS } from './components/index';

@NgModule({
  exports: [
    //CdkTableModule,
    MatAutocompleteModule,
    //MatButtonModule,
    //MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    //MatDialogModule,
    MatExpansionModule,
    //MatGridListModule,
   // MatIconModule,
    MatInputModule,
    MatListModule,
    //MatMenuModule,
    MatNativeDateModule,
    //MatPaginatorModule,
    //MatProgressBarModule,
    //MatProgressSpinnerModule,
    MatRadioModule,
    //MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    //MatSliderModule,
    //MatSlideToggleModule,
    //MatSnackBarModule,
    //MatSortModule,
    //MatTableModule,
    MatTabsModule,
    //MatToolbarModule,
    //MatTooltipModule,
    Ng2GoogleChartsModule,
  ]
})
export class SharedMaterialModule {}

const SHARED_MODULES: any[] = [
  CommonModule,
  RouterModule,
  BrowserModule,
  HttpModule,
  FormsModule,
  ReactiveFormsModule,
  MatNativeDateModule,
  BrowserAnimationsModule,
  Angular2FontawesomeModule,
  MomentModule,
  HttpClientModule
];

/**
 * SharedModule
 * Only for shared components, directives and pipes
 * Do not specify providers here
 * https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#what-kinds-of-modules-should-i-have-and-how-should-i-use-them-
 */

@NgModule({
  imports: [
    ...SHARED_MODULES,  
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCOm1K8tIc7J9GpKEjCKp4VnCwVukqic2g'
    }),
  ],
  declarations: [
    ...SHARED_COMPONENTS
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  exports: [
    ...SHARED_MODULES,
    SharedMaterialModule,
    ...SHARED_COMPONENTS,
    AgmCoreModule
  ],
  providers: [
    GoogleMapsAPIWrapper
  ]
})
export class SharedModule {}
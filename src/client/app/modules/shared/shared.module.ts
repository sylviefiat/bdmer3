import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdCardModule, MdInputModule, MdListModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { AgmCoreModule } from '@agm/core';

// modules
import { MultilingualModule } from '../i18n/index';
import { SHARED_COMPONENTS } from './components/index';


const SHARED_MODULES: any[] = [
  CommonModule,
  RouterModule,
  BrowserModule,
  HttpModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  MultilingualModule,
  BrowserAnimationsModule,
  MdCardModule,
  MdInputModule, 
  MdListModule,
  Angular2FontawesomeModule 
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
    ...SHARED_COMPONENTS,
    AgmCoreModule
  ]
})
export class SharedModule {}

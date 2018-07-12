import { GlobalImportPageComponent } from './global-import-page.component';
import { GlobalImportComponent } from './global-import.component';
import { GlobalImportStationComponent } from './global-import-station.component';
import { GlobalImportSurveyComponent } from './global-import-survey.component';
import { GlobalImportCountComponent } from './global-import-count.component';
import { PreviewMapCountGlobalImportComponent } from "./global-import-count-map.component";
import { PreviewMapStationGlobalImportComponent } from "./global-import-station-map.component";


export const GLOBAL_IMPORT_COMPONENTS: any[] = [
  GlobalImportPageComponent,
  GlobalImportComponent,
  GlobalImportStationComponent,
  GlobalImportSurveyComponent,
  GlobalImportCountComponent,  
  PreviewMapStationGlobalImportComponent,
  PreviewMapCountGlobalImportComponent
];

export * from './global-import-page.component';
export * from './global-import.component';
export * from './global-import-station.component';
export * from './global-import-survey.component';
export * from './global-import-count.component';
export * from "./global-import-count-map.component";
export * from "./global-import-station-map.component";
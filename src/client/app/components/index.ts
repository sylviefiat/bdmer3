import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './home/map.component';
import { LoginComponent } from './login/login.component';
import { LoginPageComponent } from './login/login-page.component';
import { LostPasswordComponent } from './login/lost-password.component';
import { LogoutComponent } from './login/logout.component';
import { CountryPageComponent } from './country/country-page.component';
import { CountryDetailComponent } from './country/country-detail.component';
import { CountryPreviewListComponent } from './country/country-preview-list.component';
import { CountryPreviewComponent } from './country/country-preview.component';
import { SelectedCountryPageComponent } from './country/selected-country-page.component';
import { UserDetailComponent } from './country/user-detail.component';
import { ViewCountryPageComponent } from './country/view-country-page.component';
import { ViewUserPageComponent } from './country/view-user-page.component';
import { SelectedUserPageComponent } from './country/selected-user-page.component';
import { NewCountryPageComponent } from './country/new-country-page.component';
import { NewCountryComponent } from './country/new-country.component';
import { NewUserPageComponent } from './country/new-user-page.component';
import { NewUserComponent } from './country/new-user.component';
import { PLATFORM_COMPONENTS } from './platform/index';
import { ZONE_COMPONENTS } from './zone/index';
import { TR_COMPONENTS } from './station/index';
import { SU_COMPONENTS } from './survey/index';
import { PA_COMPONENTS } from './preference-area/index';
import { COUNT_COMPONENTS } from './count/index';
import { SP_COMPONENTS } from './species/index';
import { ANALYSE_COMPONENTS } from './analyse/index';

export const APP_COMPONENTS: any[] = [
  ...PLATFORM_COMPONENTS,
  ...SP_COMPONENTS,
  ...ZONE_COMPONENTS,
  ...SU_COMPONENTS,
  ...TR_COMPONENTS,
  ...PA_COMPONENTS,
  ...COUNT_COMPONENTS,
  ...ANALYSE_COMPONENTS,
  AppComponent,
  NavbarComponent,
  ToolbarComponent,
  AboutComponent,
  HomeComponent,
  MapComponent,
  LoginComponent,
  LoginPageComponent,
  LostPasswordComponent,
  LogoutComponent,
  CountryPageComponent,
  NewCountryPageComponent,
  NewCountryComponent,
  UserDetailComponent,
  CountryPreviewListComponent,
  CountryPreviewComponent,
  CountryDetailComponent,
  SelectedCountryPageComponent,
  ViewCountryPageComponent,
  ViewUserPageComponent,
  SelectedUserPageComponent,
  NewUserPageComponent,
  NewUserComponent,

];

export * from './app.component';
export * from './navbar/navbar.component';
export * from './toolbar/toolbar.component';
export * from './about/about.component';
export * from './home/home.component';
export * from './home/map.component';
export * from './login/login.component';
export * from './login/login-page.component';
export * from './login/logout.component';
export * from './login/lost-password.component';
export * from './country/country-page.component';
export * from './country/country-preview-list.component';
export * from './country/country-preview.component';
export * from './country/country-detail.component';
export * from './country/selected-country-page.component';
export * from './country/user-detail.component';
export * from './country/view-country-page.component';
export * from './country/view-user-page.component';
export * from  './country/selected-user-page.component';
export * from './country/new-country.component';
export * from './country/new-country-page.component';
export * from './country/new-user-page.component';
export * from './country/new-user.component';
export * from './platform/index';
export * from './zone/index';
export * from './survey/index';
export * from './station/index';
export * from './preference-area/index';
export * from './count/index';
export * from './species/index';

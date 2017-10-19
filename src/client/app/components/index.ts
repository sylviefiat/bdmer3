import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { BookAuthorsComponent } from './book/book-authors';
import { BookDetailComponent } from './book/book-detail';
import { BookPreviewComponent } from './book/book-preview';
import { BookPreviewListComponent } from './book/book-preview-list';
import { BookSearchComponent } from './book/book-search';
import { FindBookPageComponent } from './book/find-book-page';
import { ViewBookPageComponent } from './book/view-book-page';
import { SelectedBookPageComponent } from './book/selected-book-page';
import { CollectionPageComponent } from './book/collection-page';
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
import { DATA_COMPONENTS } from './management/index';

export const APP_COMPONENTS: any[] = [
  ...DATA_COMPONENTS,
  AppComponent,
  AboutComponent,
  HomeComponent,
  MapComponent,
  BookAuthorsComponent,
  BookDetailComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
  FindBookPageComponent,
  ViewBookPageComponent,
  SelectedBookPageComponent,
  CollectionPageComponent,
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
export * from './about/about.component';
export * from './home/home.component';
export * from './book/book-authors';
export * from './book/book-detail';
export * from './book/book-preview';
export * from './book/book-preview-list';
export * from './book/book-search';
export * from './book/find-book-page';
export * from './book/view-book-page';
export * from './book/selected-book-page';
export * from './book/collection-page';
export * from './map/map.component';
export * from './login/login.component';
export * from './login/login-page.component';
export * from './login/logout.component';
export * from './login/lost-password.component';;
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
export * from './management/index';
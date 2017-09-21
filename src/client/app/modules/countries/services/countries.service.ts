import { Injectable, Output, EventEmitter } from '@angular/core';

import { User, Country } from '../../countries/models/country';

@Injectable()
export class CountriesService {
  public currentCountry: Country;
  public currentUser: User;

  @Output() getCurrentUser: EventEmitter<Country> = new EventEmitter();

  // MANY CLEVER THINGS

}
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { CountriesAction } from '../actions/index';
import { IAppState, getCountriesisLoaded, getCountryEntities } from '../../ngrx/index';
import { ICountriesState  } from '../states/index';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class CountryExistsGuard implements CanActivate {
  constructor(
    private countriesStore: Store<IAppState>,
    private router: Router
  ) {}

  /**
   * This method creates an observable that waits for the `loaded` property
   * of the collection state to turn `true`, emitting one time once loading
   * has finished.
   */
  waitForCountriesToLoad(): Observable<boolean> {
    return this.countriesStore
      .let(getCountriesisLoaded)
      .filter(loaded => loaded)
      .take(1);
  }

  /**
   * This method checks if a book with the given ID is already registered
   * in the Store
   */
  hasCountryInDB(id: string): Observable<boolean> {
    console.log(id);
    return this.countriesStore
      .select(getCountryEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  /**
   * `hasBook` composes `hasBookInStore` and `hasBookInApi`. It first checks
   * if the book is in store, and if not it then checks if it is in the
   * API.
   */
  hasCountry(id: string): Observable<boolean> {
    console.log(id);
    return this.hasCountryInDB(id);   
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a book from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log(route);
    return this.waitForCountriesToLoad().switchMap(() =>
      this.hasCountry(route.params['id'])
    );
  }
}

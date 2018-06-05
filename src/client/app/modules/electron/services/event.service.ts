// libs
import { Observable, fromEvent } from 'rxjs';

declare var window: any;

export class ElectronEventService {

  public static on(name: string): Observable<any> {
    return fromEvent(window, name);
  }

  // TODO: add more helpers for menu setup and more...  
}

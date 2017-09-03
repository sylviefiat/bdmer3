// app
import { ILang } from '../../core/index';

export class DesktopConfig {

  public static GET_SUPPORTED_LANGUAGES(): Array<ILang> {
    return [
      { code: 'en', title: 'ENGLISH' },
      { code: 'fr', title: 'FRENCH' }
    ];
  }

}

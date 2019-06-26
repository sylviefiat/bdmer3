import { Task } from './task';
import Config from '../config';

export abstract class CssTask extends Task {

  shallRun(files: String[]): boolean {
    return Config.ENABLE_SCSS || files.some(f =>
      f.endsWith('.css') || f.endsWith('.sass') || f.endsWith('.scss'));
  }

}

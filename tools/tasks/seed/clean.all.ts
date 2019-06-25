import Config from '../../config';
import { clean } from '../../utils';

/**
 * Executes the build process, cleaning all files within the `/dist` directory.
 */
export default clean([Config.DIST_DIR, Config.COVERAGE_DIR, Config.TNS_APP_DEST]);

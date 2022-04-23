import { join } from 'path';
import { staticFolderName } from '@/constants';

const ServeStaticOptions = {
  serveRoot: join('/', staticFolderName),
  rootPath: join(process.cwd(), staticFolderName),
};

export default ServeStaticOptions;

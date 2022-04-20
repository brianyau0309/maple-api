import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

const CustomConfigModule = ConfigModule.forRoot({ load: [configuration] });
export default CustomConfigModule;

import { ConfigModule, ConfigService } from '@nestjs/config';

const MongooseOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('database.uri'),
  }),
};

export default MongooseOptions;

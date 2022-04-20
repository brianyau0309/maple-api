import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import CustomConfigModule from '../config/config.module';
import { staticFolderName } from '../constants';
import CustomMongooseModule from '../mongoose/mongoose.module';
import { MusicModule } from '../music/music.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: join('/', staticFolderName),
      rootPath: join(__dirname, '..', '..', staticFolderName),
    }),
    CustomConfigModule,
    CustomMongooseModule,
    MusicModule,
  ],
})
export class AppModule {}

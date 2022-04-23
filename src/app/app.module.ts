import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/auth/auth.module';
import { MusicModule } from '@/music/music.module';
import {
  ConfigModuleOptions,
  MongooseModuleOptions,
  ServeStaticModuleOptions,
} from '@/config/options';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleOptions),
    ServeStaticModule.forRoot(ServeStaticModuleOptions),
    MongooseModule.forRootAsync(MongooseModuleOptions),
    AuthModule,
    MusicModule,
  ],
})
export class AppModule {}

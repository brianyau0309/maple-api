import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/auth/auth.module';
import { MusicModule } from '@/music/music.module';
import { ConfigModuleOptions, MongooseModuleOptions } from '@/config/options';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleOptions),
    MongooseModule.forRootAsync(MongooseModuleOptions),
    AuthModule,
    MusicModule,
  ],
})
export class AppModule {}

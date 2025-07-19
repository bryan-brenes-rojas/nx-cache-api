import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import awsConfig from './config/aws.config';
import { NxModule } from './nx/nx.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [awsConfig] }),
    NxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config, validationSchema } from './config';
import { NxModule } from './nx/nx.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...config],
      validationSchema,
    }),
    NxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { NxModule } from './nx/nx.module';

@Module({
  imports: [NxModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { NxController } from './nx.controller';
import { NxService } from './nx.service';

@Module({
  controllers: [NxController],
  providers: [NxService],
})
export class NxModule {}

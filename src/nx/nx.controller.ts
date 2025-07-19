import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { NxService } from './nx.service';

@Controller({ path: 'cache', version: '1' })
export class NxController {
  constructor(private readonly nxService: NxService) {}

  @Get(':hash')
  async getCacheItem(@Param('hash') hash: string): Promise<string> {
    return this.nxService.getCacheItem(hash);
  }

  @Put(':hash')
  async putCacheItem(
    @Param('hash') hash: string,
    @Req() body: Buffer,
  ): Promise<string> {
    return this.nxService.putCacheItem(hash, body);
  }
}

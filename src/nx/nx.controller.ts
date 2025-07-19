import { Body, Controller, Get, Header, Param, Put } from '@nestjs/common';
import { NxService } from './nx.service';

@Controller({ path: 'cache', version: '1' })
export class NxController {
  constructor(private readonly nxService: NxService) {}

  @Get(':hash')
  @Header('Content-Type', 'application/octet-stream')
  async getCacheItem(@Param('hash') hash: string): Promise<Buffer> {
    console.log('get cache item', hash);
    const rs = await this.nxService.getCacheItem(hash);
    console.log(rs);
    return rs;
  }

  @Put(':hash')
  async putCacheItem(
    @Param('hash') hash: string,
    @Body() body: any,
  ): Promise<string> {
    console.log('put cache item', hash);
    return this.nxService.putCacheItem(hash, body);
  }
}

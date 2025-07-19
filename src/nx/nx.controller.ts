import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Put,
  Response,
} from '@nestjs/common';
import { NxService } from './nx.service';

@Controller({ path: 'cache', version: '1' })
export class NxController {
  constructor(private readonly nxService: NxService) {}

  @Get(':hash')
  @Header('Content-Type', 'application/octet-stream')
  async getCacheItem(
    @Param('hash') hash: string,
    @Response() res: Response,
  ): Promise<void> {
    console.log('get cache item', hash);
    return this.nxService.getCacheItem(hash, res as any);
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

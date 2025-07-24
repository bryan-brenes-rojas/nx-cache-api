import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
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
    return this.nxService.getCacheItem(hash, res as any);
  }

  @Put(':hash')
  @HttpCode(HttpStatus.ACCEPTED)
  async putCacheItem(
    @Param('hash') hash: string,
    @Body() body: any,
  ): Promise<string> {
    return this.nxService.putCacheItem(hash, body);
  }
}

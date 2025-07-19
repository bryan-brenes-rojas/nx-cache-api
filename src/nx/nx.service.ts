import { Injectable } from '@nestjs/common';

@Injectable()
export class NxService {
  async putCacheItem(hash: string, value: string): Promise<string> {
    return `Cache item for hash ${hash} updated with value ${value}`;
  }

  async getCacheItem(hash: string): Promise<string> {
    return `Cache item for hash ${hash}`;
  }
}

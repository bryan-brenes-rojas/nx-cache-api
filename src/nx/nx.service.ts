import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NxService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('aws.region');
    this.s3Client = new S3Client({ region });
  }

  async putCacheItem(hash: string, value: string): Promise<string> {
    return `Cache item for hash ${hash} updated with value ${value}`;
  }

  async getCacheItem(hash: string): Promise<string> {
    return `Cache item for hash ${hash}`;
  }
}

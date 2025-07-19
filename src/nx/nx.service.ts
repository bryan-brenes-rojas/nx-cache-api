import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class NxService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('aws.region')!;
    const accessKeyId = this.configService.get<string>('aws.accessKeyId')!;
    const secretAccessKey = this.configService.get<string>(
      'aws.secretAccessKey',
    )!;
    const endpoint = this.configService.get<string>('aws.endpoint')!;
    this.s3Client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async putCacheItem(hash: string, body: Buffer): Promise<string> {
    let exists = true;
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: 'cache',
          Key: hash,
        }),
      );
    } catch (error: any) {
      if (error instanceof Error && error.name === 'NotFound') {
        exists = false;
      } else {
        throw error;
      }
    }

    if (exists) {
      throw new ConflictException('Cannot override an existing record');
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'cache',
        Key: hash,
        Body: new Uint8Array(body),
      }),
    );

    return 'Successfully uploaded';
  }

  async getCacheItem(hash: string, res: Response): Promise<void> {
    const command = new GetObjectCommand({
      Bucket: 'cache',
      Key: hash,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
    res.redirect(url);
  }
}

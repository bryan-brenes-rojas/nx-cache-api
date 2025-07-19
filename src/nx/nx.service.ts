import {
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

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
        console.log('Object not found');
        exists = false;
      } else {
        console.log('Error:', error);
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

  async getCacheItem(hash: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: 'cache',
      Key: hash,
    });
    let res: GetObjectCommandOutput;
    try {
      res = await this.s3Client.send(command);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error message:', error.message);

        const awsError = error as { name?: string; $metadata?: any };
        const errorCode = awsError.$metadata?.httpStatusCode;
        if (errorCode === 404) {
          throw new NotFoundException(error.name);
        }
        throw new ForbiddenException();
      } else {
        throw new Error('Unknown error');
      }
    }
    const bodyStream = res.Body as Readable;
    return this.streamToBuffer(bodyStream);
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }
}

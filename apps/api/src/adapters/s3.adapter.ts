import {
  //   Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as AWS from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { Stream } from 'stream';
import { StorageService } from '../interfaces';
import { convertImageToPng } from 'src/helpers';

export class S3Adapter implements StorageService {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  async uploadMP3(buffer: Buffer, fileName: string): Promise<string> {
    const folderPath = 'audio/';

    const input: AWS.PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: folderPath + fileName.toLocaleLowerCase(),
      Body: buffer,
      ContentType: 'audio/mp3',
    };

    try {
      const response = await new Upload({
        client: this.s3,
        params: input,
      }).done();

      return response.Location;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error uploading file to S3');
    }
  }

  async getFile(fileName: string): Promise<Stream> {
    //? check if filename is mp3 or png
    const fileExtension = fileName.split('.').pop();

    if (!fileExtension || !['mp3', 'png'].includes(fileExtension)) {
      throw new NotFoundException('File not found');
    }

    //? Determine the extension of the file
    const folder = fileExtension === 'mp3' ? 'audio/' : 'images/';

    const input: AWS.GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: folder + fileName.toLocaleLowerCase(),
      //check in audio or images folder
    };

    try {
      const response = await this.s3.send(new AWS.GetObjectCommand(input));
      return response.Body as Stream;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('File not found');
    }
  }

  async getAllMP3(): Promise<string[]> {
    try {
      const params: AWS.ListObjectsV2CommandInput = {
        Bucket: this.bucket,
        Prefix: 'audio/',
      };
      const data = await this.s3.send(new AWS.ListObjectsV2Command(params));

      if (!data.Contents) {
        return [];
      }

      return data.Contents.filter((file) => file.Key?.endsWith('.mp3')).map(
        (file) => file.Key as string,
      );
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Error listing files from S3');
    }
  }

  async UploadImage(url: string): Promise<string> {
    //convert image to png
    const response = await fetch(url);

    if (!response.ok) {
      throw new InternalServerErrorException('Error uploading image');
    }

    const imageNamePng = `${Date.now()}.png`;
    const buffer = await convertImageToPng(
      Buffer.from(await response.arrayBuffer()),
    );

    //? Upload image to S3
    const folderPath = 'images/';

    const input: AWS.PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: folderPath + imageNamePng.toLocaleLowerCase(),
      Body: buffer,
      ContentType: 'image/png',
    };

    try {
      const response = await new Upload({
        client: this.s3,
        params: input,
      }).done();
      return response.Location;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Image upload to S3 failed');
    }
  }
}

import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadImageToFirebase(avatar: Express.Multer.File): Promise<string> {
    const bucket = admin.storage().bucket();

    const uniqueFilename = `avatars/${Date.now()}-${avatar.originalname}`;

    const blob = bucket.file(uniqueFilename);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (error) => {
      throw new HttpException(
        `Error uploading file: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise<string>((resolve, reject) => {
      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;

        resolve(publicUrl);
      });

      blobStream.end(avatar.buffer);
    });
  }
}

// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private storageBucket: admin.storage.Bucket;

  constructor() {
    const serviceAccount = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../path/to/your/firebase-key.json'),
        'utf8',
      ),
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    this.storageBucket = admin.storage().bucket();
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uniqueFilename = Date.now() + '-' + file.originalname;

    const fileUpload = this.storageBucket.file(uniqueFilename);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      throw error;
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on('finish', () => {
        const imageUrl = `https://storage.googleapis.com/${this.storageBucket.name}/${uniqueFilename}`;
        resolve(imageUrl);
      });

      blobStream.end(file.buffer);
    });
  }
}

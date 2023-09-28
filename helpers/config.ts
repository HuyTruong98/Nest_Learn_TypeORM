/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';

export const storageConfig = (folder: string) =>
  diskStorage({
    destination: `public/${folder}`,
    filename(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';

export const storageConfig = (folder: string) =>
  diskStorage({
    destination: `public/${folder}`,
    filename(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

export const parseSortParam = (
  sortParam: string,
): Record<string, 'ASC' | 'DESC'> => {
  if (!sortParam) {
    return {};
  }

  const sortSegments = sortParam.split(',').map((item) => item.trim());

  const order: Record<string, 'ASC' | 'DESC'> = {};

  sortSegments.forEach((segment) => {
    const [fieldName, orderDirection] = segment.split(' ');
    if (fieldName && orderDirection) {
      order[fieldName] =
        orderDirection.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    }
  });

  return order;
};

export const generateUUID = () => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );
  return uuid;
};

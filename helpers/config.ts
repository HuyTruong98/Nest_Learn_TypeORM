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

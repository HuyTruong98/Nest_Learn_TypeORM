import { User } from 'src/user/entities/user.entity';

export class PostDto {
  id?: number;
  title: string;
  description: string;
  status: number;
  thumbnail: string;
  user: User;
}

export class QueryPostDto {
  page: number;
  perPage: number;
  keyword: string;
  sort?: string;
}

export class UpdatePostDto {
  title: string;
  description: string;
  status: number;
  thumbnail: string;
}

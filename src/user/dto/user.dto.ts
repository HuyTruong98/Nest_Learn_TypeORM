/* eslint-disable prettier/prettier */

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class updateUserDto {
  status?: number;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export class filterQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;
  @IsOptional()
  @IsNumber()
  perPage?: number;
  @IsOptional()
  @IsString()
  keyword?: string;
  @IsOptional()
  @IsNumber()
  status?: number;
  sort?: string;
}

export class listUserDto {
  data: User[];
  total: number;
  currentPage: number;
  nextPage: number;
  lastPage: number;
  prevPage: number;
}

export class UserDataDto {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

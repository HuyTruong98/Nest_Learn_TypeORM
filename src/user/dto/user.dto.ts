/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';
export class userDto {
  @IsNotEmpty()
  firstName?: string;

  @IsNotEmpty()
  lastName?: string;

  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;
  status?: number;
  regDt?: string;
  modDt?: string;
}

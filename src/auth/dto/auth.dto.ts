/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
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

export class LoginTokenDto {
  access_token: string;
  refresh_token: string;
}

export class BodyLogin {
  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;
}

/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  password?: string;

  @ApiProperty()
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
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  password?: string;
}

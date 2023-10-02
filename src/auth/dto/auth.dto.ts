/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  firstName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
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
  @MaxLength(255)
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  password?: string;
}

export class refresh_token {
  @ApiProperty()
  @IsNotEmpty()
  refresh_token?: string;
}

export class emailVerify {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  email?: string;
}

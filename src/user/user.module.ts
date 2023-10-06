import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from 'src/firebase/firebase.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    MulterModule.register({
      dest: null,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UploadService],
})
export class UserModule {}

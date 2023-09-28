import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthDto } from 'src/auth/dto/auth.dto';
import {
  UserDataDto,
  filterQueryDto,
  listUserDto,
  updateUserDto,
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'perPage' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() query: filterQueryDto): Promise<listUserDto> {
    return this.userService.findAllService(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOneService(Number(id));
  }

  @Post('info')
  createUser(@Body() body: AuthDto): Promise<User> {
    return this.userService.createService(body);
  }

  @Put(':id')
  updateById(@Param('id') id: number, @Body() body: updateUserDto) {
    return this.userService.updateByIdService(Number(id), body);
  }

  @Delete(':id')
  deleteById(@Param('id') id: number) {
    return this.userService.deleteByIdService(Number(id));
  }

  @Post('/upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('img'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.png', '.jpg', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadImg(
    @Req()
    req: Request & { user_data: UserDataDto; fileValidationError: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required!');
    }
    return this.userService.updateAvatarService(
      req.user_data.id,
      file.destination + '/' + file.filename,
    );
  }
}

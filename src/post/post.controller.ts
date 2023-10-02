import {
  BadRequestException,
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDataDto, listDto } from 'src/user/dto/user.dto';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostService } from './post.service';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private postService: PostService) {}

  @Post('info')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
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
  create(
    @Req()
    req: Request & { user_data: UserDataDto; fileValidationError: string },
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    return this.postService.createPostService(req['user_data'].id, {
      ...body,
      thumbnail: file.destination + '/' + file.filename,
    });
  }

  @Get('/list')
  findAll(@Query() query: QueryPostDto): Promise<listDto> {
    return this.postService.getAllPostService(query);
  }

  @Get('/:id')
  findById(@Param('id') param: number): Promise<PostEntity> {
    return this.postService.findByIdService(Number(param));
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
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
  updateById(
    @Param('id') id: number,
    @Req()
    req: Request & { user_data: UserDataDto; fileValidationError: string },
    @Body() body: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (file) {
      body.thumbnail = file.destination + '/' + file.filename;
    }

    return this.postService.updateByIdService(Number(id), body);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: number) {
    return this.postService.deleteByIdService(Number(id));
  }
}

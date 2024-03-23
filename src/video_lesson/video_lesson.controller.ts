import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Video_lessonService } from './video_lesson.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { Video_lessonDto } from './dto/video_lesson.dto';
import { ChatDto } from '../chat/dto/chat.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Video_lesson')
@Controller('video_lesson')
export class Video_lessonController {
  constructor(private readonly video_lessonService: Video_lessonService) {}

  // @ApiOperation({ summary: 'Create a new video_lesson' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       content: {
  //         type: 'string',
  //       },
  //       video: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @Post()
  // @UseInterceptors(FileInterceptor('image'))
  // create() // @Body() video_lessonDto: Video_lessonDto,
  // // @UploadedFile(new ImageValidationPipe()) video: Express.Multer.File,
  // {
  //   console.log('object');
  //   // return this.video_lessonService.create(video_lessonDto, video);
  // }

  @ApiOperation({ summary: 'Create a new chat' })
  // @UseGuards(AuthGuard)
  @Post()
  create(@Body() video_lessonDto: Video_lessonDto) {
    return this.video_lessonService.create(video_lessonDto);
  }

  @ApiOperation({ summary: 'Get all video_lessons' })
  // @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.video_lessonService.getAll();
  }

  @ApiOperation({ summary: 'Get video_lesson by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.video_lessonService.getById(id);
  }

  @ApiOperation({ summary: 'Get video_lessons with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.video_lessonService.pagination(page);
  }

  @ApiOperation({ summary: 'Update video_lesson profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() video_lessonDto: Video_lessonDto) {
    return this.video_lessonService.update(id, video_lessonDto);
  }

  @ApiOperation({ summary: 'Delete video_lesson' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteVideo_lesson(@Param('id') id: number) {
    return this.video_lessonService.delete(id);
  }
}

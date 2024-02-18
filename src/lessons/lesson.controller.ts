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
import { LessonService } from './lesson.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { LessonDto } from './dto/lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatDto } from '../chat/dto/chat.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @ApiOperation({ summary: 'Create a new lesson' })
  @Post('/create')
  create(@Body() lessonDto: LessonDto) {
    return this.lessonService.create(lessonDto);
  }
 
  @ApiOperation({ summary: 'Get lesson by ID' })
  // @UseGuards(AuthGuard)
  @Get('/getById/:id/:class_name')
  getById(@Param('id') id: number, @Param('class_name') class_name: number) {
    return this.lessonService.getById(id, class_name);
  }

  @ApiOperation({ summary: 'Get all lessons' })
  // @UseGuards(AuthGuard)
  @Get('/:class_name/:subject')
  getAll(
    @Param('class_name') class_name: number,
    @Param('subject') subject: string,
  ) {
    return this.lessonService.getAll(class_name, subject);
  }


  @ApiOperation({ summary: 'Get lessons with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.lessonService.pagination(page);
  }

  @ApiOperation({ summary: 'Update lesson profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() lessonDto: LessonDto) {
    return this.lessonService.update(id, lessonDto);
  }

  @ApiOperation({ summary: 'Delete lesson' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteLesson(@Param('id') id: number) {
    return this.lessonService.delete(id);
  }
}

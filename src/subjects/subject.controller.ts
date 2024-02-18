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
import { SubjectService } from './subject.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { SubjectDto } from './dto/subject.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatDto } from '../chat/dto/chat.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@ApiTags('Subject')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ summary: 'Create a new subject' })
  @Post('/create')
  create(@Body() subjectDto: SubjectDto) {
    return this.subjectService.create(subjectDto);
  }
  
  @ApiOperation({ summary: 'Get all subjects' })
  // @UseGuards(AuthGuard)
  @Get()
  getSubjects() {
    return this.subjectService.getSubjects();
  }

  @ApiOperation({ summary: 'Get all subjects' })
  // @UseGuards(AuthGuard)
  @Get('/:class_number')
  getAll(@Param('class_number') class_number: number) {
    return this.subjectService.getAll(class_number);
  }


  @ApiOperation({ summary: 'Get subject by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.subjectService.getById(id);
  }

  @ApiOperation({ summary: 'Get subjects with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.subjectService.pagination(page);
  }

  @ApiOperation({ summary: 'Update subject profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() subjectDto: SubjectDto) {
    return this.subjectService.update(id, subjectDto);
  }

  @ApiOperation({ summary: 'Delete subject' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteSubject(@Param('id') id: number) {
    return this.subjectService.delete(id);
  }
}

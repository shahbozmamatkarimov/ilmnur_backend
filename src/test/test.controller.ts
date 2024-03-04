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
import { TestService } from './test.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { TestDto } from './dto/test.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatDto } from '../chat/dto/chat.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { CheckDto } from './dto/check.dto';

@ApiTags('Test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) { }

  @ApiOperation({ summary: 'Create a new test' })
  @Post('/create')
  create(@Body() testDto: TestDto) {
    return this.testService.create(testDto);
  }

  @ApiOperation({ summary: 'Create a new test' })
  @Post('/check/:id')
  checkAnswers(@Param('id') id: number, @Body() checkDto: CheckDto) {
    return this.testService.checkAnswers(id, checkDto);
  }

  @ApiOperation({ summary: 'Get all tests' })
  // @UseGuards(AuthGuard)
  @Get()
  getTests() {
    return this.testService.getTests();
  }

  @ApiOperation({ summary: 'Get test by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.testService.getById(id);
  }

  @ApiOperation({ summary: 'Get tests with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.testService.pagination(page);
  }

  @ApiOperation({ summary: 'Update test profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() testDto: TestDto) {
    return this.testService.update(id, testDto);
  }

  @ApiOperation({ summary: 'Delete test' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTest(@Param('id') id: number) {
    return this.testService.delete(id);
  }
}

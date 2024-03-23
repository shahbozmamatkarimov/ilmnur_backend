import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TestsService } from './test.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestsDto } from './dto/test.dto';

@ApiTags('Tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @ApiOperation({ summary: 'Create a new tests' })
  @Post('/create')
  create(@Body() testsDto: TestsDto) {
    return this.testsService.create(testsDto);
  }

  @ApiOperation({ summary: 'Get all testss' })
  // @UseGuards(AuthGuard)
  @Get()
  getTestss() {
    return this.testsService.getTestss();
  }

  @ApiOperation({ summary: 'Get all testss' })
  // @UseGuards(AuthGuard)
  @Get('/:class_number')
  getAll(@Param('class_number') class_number: number) {
    return this.testsService.getAll(class_number);
  }

  @ApiOperation({ summary: 'Get tests by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.testsService.getById(id);
  }

  @ApiOperation({ summary: 'Get testss with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.testsService.pagination(page);
  }

  @ApiOperation({ summary: 'Update tests profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() testsDto: TestsDto) {
    return this.testsService.update(id, testsDto);
  }

  @ApiOperation({ summary: 'Delete tests' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTests(@Param('id') id: number) {
    return this.testsService.delete(id);
  }
}

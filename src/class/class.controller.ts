import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClassDto } from './dto/class.dto';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @ApiOperation({ summary: 'Create a new class' })
  @Post('/create')
  create(@Body() classDto: ClassDto) {
    return this.classService.create(classDto);
  }

  @ApiOperation({ summary: 'Get class by ID' })
  // @UseGuards(AuthGuard)
  @Get('/getById/:id/:class_name')
  getById(@Param('id') id: number, @Param('class_name') class_name: number) {
    return this.classService.getById(id, class_name);
  }

  @ApiOperation({ summary: 'Get all classs' })
  // @UseGuards(AuthGuard)
  @Get()
  getAll(
  ) {
    return this.classService.getAll();
  }


  @ApiOperation({ summary: 'Get classs with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.classService.pagination(page);
  }

  @ApiOperation({ summary: 'Update class profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() classDto: ClassDto) {
    return this.classService.update(id, classDto);
  }

  @ApiOperation({ summary: 'Delete class' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteClass(@Param('id') id: number) {
    return this.classService.delete(id);
  }
}

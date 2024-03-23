import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadedService } from './uploaded.service';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadedDto } from './dto/uploaded.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';

@ApiTags('Uploaded')
@Controller('uploaded')
export class UploadedController {
  constructor(private readonly uploadedService: UploadedService) {}

  @ApiOperation({ summary: 'Create a new video_lesson' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        is_active: {
          type: 'boolean',
        },
        file_type: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() uploadedDto: UploadedDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File) {
    return this.uploadedService.create(file, uploadedDto);
  }

  @ApiOperation({ summary: 'Get class by ID' })
  // @UseGuards(AuthGuard)
  @Get('/getById/:id/:class_name')
  getById(@Param('id') id: number) {
    return this.uploadedService.getById(id);
  }

  @ApiOperation({ summary: 'Get all classs' })
  // @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.uploadedService.getAll();
  }

  @ApiOperation({ summary: 'Get classs with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.uploadedService.pagination(page);
  }

  @ApiOperation({ summary: 'Update class profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() classDto: UploadedDto) {
    return this.uploadedService.update(id, classDto);
  }

  @ApiOperation({ summary: 'Delete class' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUploaded(@Param('id') id: number) {
    return this.uploadedService.delete(id);
  }
}

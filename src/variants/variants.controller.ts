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
import { VariantsService } from './variants.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { VariantsDto } from './dto/variants.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatDto } from '../chat/dto/chat.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@ApiTags('Variants')
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @ApiOperation({ summary: 'Create a new variants' })
  @Post('/create')
  create(@Body() variantsDto: VariantsDto) {
    return this.variantsService.create(variantsDto);
  }

  @ApiOperation({ summary: 'Get all variantss' })
  // @UseGuards(AuthGuard)
  @Get()
  getVariantss() {
    return this.variantsService.getVariantss();
  }

  @ApiOperation({ summary: 'Get all variantss' })
  // @UseGuards(AuthGuard)
  @Get('/:class_number')
  getAll(@Param('class_number') class_number: number) {
    return this.variantsService.getAll(class_number);
  }

  @ApiOperation({ summary: 'Get variants by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.variantsService.getById(id);
  }

  @ApiOperation({ summary: 'Get variantss with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.variantsService.pagination(page);
  }

  @ApiOperation({ summary: 'Update variants profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() variantsDto: VariantsDto) {
    return this.variantsService.update(id, variantsDto);
  }

  @ApiOperation({ summary: 'Delete variants' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteVariants(@Param('id') id: number) {
    return this.variantsService.delete(id);
  }
}

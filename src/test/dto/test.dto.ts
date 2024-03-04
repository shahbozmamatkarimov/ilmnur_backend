import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class TestDto {
  @ApiProperty({
    example: 'Natural sonlar',
    description: 'Title of the test',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 1,
    description: 'Lesson id of the test',
  })
  @IsNotEmpty()
  @IsNumber()
  lesson_id: number;
}

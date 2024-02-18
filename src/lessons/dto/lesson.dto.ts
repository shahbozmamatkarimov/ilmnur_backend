import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LessonDto {
  @ApiProperty({
    example: 'Atomlar haqida',
    description: 'Lesson Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '1',
    description: 'Class number',
  })
  @IsNotEmpty()
  @IsNumber()
  class: number;

  @ApiProperty({
    example: '1',
    description: 'Subject id',
  })
  @IsNotEmpty()
  @IsNumber()
  subject_id: number;
}

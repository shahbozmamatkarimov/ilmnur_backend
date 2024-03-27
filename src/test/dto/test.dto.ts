import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class TestsDto {
  @ApiProperty({
    example: 1,
    description: 'Test id of the tests',
  })
  @IsNotEmpty()
  @IsNumber()
  lesson_id: number;

  @ApiProperty({
    example: 'Quyidagi izotopda nechta proton, elektron va neytron bor? 18^F-',
    description: 'Question of the tests',
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    example: [
      '5 proton, 4 elektron, 2 neytron',
      '4 proton, 8 elektron, 1 neytron',
      '6 proton, 1 elektron, 8 neytron',
    ],
    description: 'Tests of the tests',
  })
  @IsNotEmpty()
  @IsArray()
  variants: string[];
}

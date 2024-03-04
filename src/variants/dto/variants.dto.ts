import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class VariantsDto {
  @ApiProperty({
    example: 1,
    description: 'Test id of the variants',
  })
  @IsNotEmpty()
  @IsNumber()
  test_id: number;

  @ApiProperty({
    example: 'Quyidagi izotopda nechta proton, elektron va neytron bor? 18^F-',
    description: 'Question of the variants',
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
    description: 'Variants of the variants',
  })
  @IsNotEmpty()
  @IsArray()
  variants: string[];
}

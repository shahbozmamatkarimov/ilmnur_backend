import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class ClassDto {
  @ApiProperty({
    example: 1,
    description: 'Class number',
  })
  @IsNotEmpty()
  @IsNumber()
  class_number: number;

  @ApiProperty({
    example: 'A',
    description: 'Class name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

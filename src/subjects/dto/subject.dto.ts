import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SubjectDto {
  @ApiProperty({
    example: 'Matematika',
    description: 'Subject Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}

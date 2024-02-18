import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class Video_lessonDto {
  @ApiProperty({
    example: 1,
    description: 'lesson id',
  })
  @IsNotEmpty()
  lesson_id: number;

  @ApiProperty({
    example: 'https://example.com',
    description: 'Video url',
  })
  video: any;

  @ApiProperty({
    example: '<p>Content</p>',
    description: 'Video url',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

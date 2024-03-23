import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class Video_lessonDto {
  @ApiProperty({
    example: 1,
    description: 'lesson id',
  })
  @IsNotEmpty()
  @IsNumber()
  lesson_id: number;

  @ApiProperty({
    example: 1,
    description: 'video id',
  })
  @IsNotEmpty()
  @IsNumber()
  video_id: number;

  @ApiProperty({
    example: '<p>Content</p>',
    description: 'Video content',
  })
  @IsOptional()
  @IsString()
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChatDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'Image url',
  })
  @IsOptional()
  file: string;

  @ApiProperty({
    example: {
      name: "File name",
      type: "word",
      size: "1234",
    },
    description: 'file info',
  })
  @IsOptional()
  file_type: object;

  @ApiProperty({
    example: 1,
    description: 'Icon id',
  })
  @IsOptional()
  icon: number;

  @ApiProperty({
    example: 'Assalamu alaikum',
    description: 'User message',
  })
  @IsOptional()
  text: string;

  @ApiProperty({
    example: 1,
    description: 'User_id',
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    example: 1,
    description: 'chatgroup_id',
  })
  @IsNotEmpty()
  chatgroup_id: number;
}

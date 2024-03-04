import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderType } from '../models/user.models';

export class UpdateDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The image of the user',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'full name of the user',
  })
  @IsOptional()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: GenderType.MALE,
    description: 'gender of the user',
    enum: GenderType,
  })
  @IsOptional()
  @IsEnum(GenderType)
  gender: GenderType;

  @ApiProperty({
    example: false,
    description: 'get answered notification for the user',
  })
  @IsOptional()
  @IsBoolean()
  get_answered: boolean;

  @ApiProperty({
    example: true,
    description: 'new task notification for the user',
  })
  @IsOptional()
  @IsBoolean()
  new_task: boolean;

  @ApiProperty({
    example: true,
    description: 'chat messages notification for the user',
  })
  @IsOptional()
  @IsBoolean()
  chat_messages: boolean;
}

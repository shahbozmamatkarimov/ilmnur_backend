import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadedDto {
  @ApiProperty({
    example: false,
    description: 'is_active',
  })
  @IsOptional()
  is_active: boolean;

  @ApiProperty({
    example: 'image',
    description: 'file type',
  })
  @IsNotEmpty()
  @IsString()
  file_type: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'John Smith',
    description: 'Full name of user',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of user',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: ['student'],
    description: 'Role of the user',
  })
  @IsNotEmpty()
  @IsArray()
  role: string[];

  @ApiProperty({
    example: [["1", "A"], ["2", "B"], ["3", "C"], ["4", "D"], ["5", "E"]],
    description: 'Classes of the user',
  })
  @IsOptional()
  @IsArray()
  class: string[][];
}

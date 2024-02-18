import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsOptional,
  MinLength,
} from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: '+998991422303',
    description: 'The phone number',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the admin',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({
    example: 'username',
    description: 'The username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}

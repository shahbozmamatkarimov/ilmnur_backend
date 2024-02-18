import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginTeacherDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of teacher',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The strong password of the teacher',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

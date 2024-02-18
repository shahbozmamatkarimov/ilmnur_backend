import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterStudentDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of student',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
}

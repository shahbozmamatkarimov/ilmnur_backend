import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of student',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
  
  @ApiProperty({
    example: '1',
    description: 'Id of student',
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}

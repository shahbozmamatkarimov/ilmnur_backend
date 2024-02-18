import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeacherDto {
  @ApiProperty({
    example: '+998990010101',
    description: 'The new phone number of the teacher',
  })
  phone?: string;

  @ApiProperty({
    example: 'alisherov@gmail.com',
    description: 'The new email address of the teacher',
  })
  email?: string;

  @ApiProperty({
    example: 'alisherov_teacher',
    description: 'The new username of the teacher',
  })
  username?: string;
}

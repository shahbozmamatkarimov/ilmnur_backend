import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiProperty({
    example: '+998990010101',
    description: 'The new phone number of the student',
  })
  phone?: string;

  @ApiProperty({
    example: 'alisherov@gmail.com',
    description: 'The new email address of the student',
  })
  email?: string;

  @ApiProperty({
    example: 'alisherov_student',
    description: 'The new username of the student',
  })
  username?: string;
}

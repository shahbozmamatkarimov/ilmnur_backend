import { FilesService } from './../files/files.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Student } from './models/student.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { RegisterStudentDto } from './dto/register.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { LoginStudentDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
  ) { }

  async register(registerStudentDto: RegisterStudentDto): Promise<object> {
    try {
      const { phone } = registerStudentDto;
      const is_phone = await this.studentRepository.findOne({
        where: { phone },
      });
      console.log(is_phone);
      if (is_phone) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'phone',
        };
      }

      const student = await this.studentRepository.create({
        ...registerStudentDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully registered!',
        data: {
          student,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async login(loginStudentDto: LoginStudentDto): Promise<object> {
  //   try {
  //     const { phone, password } = loginStudentDto;
  //     const student = await this.studentRepository.findOne({ where: { phone } });
  //     if (!student) {
  //       throw new NotFoundException('Telefon raqam yoki parol xato!');
  //     }
  //     const is_match_pass = await compare(password, student.hashed_password);
  //     if (!is_match_pass) {
  //       throw new ForbiddenException('Login yoki parol xato!');
  //     }
  //     // return this.otpService.sendOTP({ phone });
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async login(
    loginStudentDto: LoginStudentDto,
    res: Response,
  ): Promise<object> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: loginStudentDto.student_id },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const { access_token, refresh_token } = await generateToken(
        { id: student.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Logged in successfully',
        data: student,
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const students = await this.studentRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: {
          students,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getReyting(): Promise<object> {
    try {
      const students = await this.studentRepository.findAll({
        order: [
          ["test_reyting", 'DESC'],
        ]
      });
      return {
        statusCode: HttpStatus.OK,
        data: students,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: student,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const students = await this.studentRepository.findAll({ offset, limit });
      const total_count = await this.studentRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: students,
          pagination: {
            currentPage: Number(page),
            total_pages,
            total_count,
          },
        },
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(
    id: string,
    newPasswordDto: NewPasswordDto,
  ): Promise<object> {
    try {
      const { old_password, new_password } = newPasswordDto;
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student not found!');
      }
      const is_match_pass = await compare(old_password, student.hashed_password);
      if (!is_match_pass) {
        throw new ForbiddenException('The old password did not match!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.studentRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Parol o'zgartirildi",
        data: {
          student: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async forgotPassword(
  //   id: string,
  //   forgotPasswordDto: ForgotPasswordDto,
  // ): Promise<object> {
  //   try {
  //     const { phone, code, new_password, confirm_new_password } =
  //       forgotPasswordDto;
  //     await this.otpService.verifyOtp({ phone, code });
  //     await this.getById(id);
  //     if (new_password != confirm_new_password) {
  //       throw new ForbiddenException('Yangi parolni tasdiqlashda xatolik!');
  //     }
  //     const hashed_password = await hash(new_password, 7);
  //     const updated_info = await this.studentRepository.update(
  //       { hashed_password },
  //       { where: { id }, returning: true },
  //     );
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: "Paroli o'zgartirildi",
  //       data: {
  //         student: updated_info[1][0],
  //       },
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async update(
    id: string,
    updateDto: UpdateDto,
  ): Promise<object> {
    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const update = await this.studentRepository.update(updateDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Updated successfully",
        data: update[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProfileImage(
    id: string,
    image: any
  ): Promise<object> {
    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      if (image) {
        image = await this.fileService.createFile(image, 'image');
        if (image == 'error') {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Error while uploading a file',
          };
        }
      }
      const update = await this.studentRepository.update({ image }, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Updated successfully",
        data: update[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateTestReyting(id: number): Promise<object> {
    try {
      console.log(id, '-----------------------')
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const test_reyting = student.test_reyting + 1;
      const update = await this.studentRepository.update({ test_reyting }, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Updated successfully",
        data: update[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteStudent(id: string): Promise<object> {
    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      student.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Deleted successfully",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

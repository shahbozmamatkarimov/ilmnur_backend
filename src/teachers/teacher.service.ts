import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './models/teacher.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { generateToken, writeToCookie } from 'src/utils/token';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher) private teacherRepository: typeof Teacher,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerTeacherDto: RegisterTeacherDto): Promise<object> {
    try {
      const { phone } = registerTeacherDto;
      const is_phone = await this.teacherRepository.findOne({ where: { phone } });
      console.log(is_phone);
      if (is_phone) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'phone',
        };
      }

      const teacher = await this.teacherRepository.create({
        ...registerTeacherDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully registered!',
        data: {
          teacher,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async login(loginTeacherDto: LoginTeacherDto): Promise<object> {
  //   try {
  //     const { phone, password } = loginTeacherDto;
  //     const teacher = await this.teacherRepository.findOne({ where: { phone } });
  //     if (!teacher) {
  //       throw new NotFoundException('Telefon raqam yoki parol xato!');
  //     }
  //     const is_match_pass = await compare(password, teacher.hashed_password);
  //     if (!is_match_pass) {
  //       throw new ForbiddenException('Login yoki parol xato!');
  //     }
  //     // return this.otpService.sendOTP({ phone });
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async verifyLogin(
  //   verifyOtpDto: VerifyOtpDto,
  //   res: Response,
  // ): Promise<object> {
  //   try {
  //     await this.otpService.verifyOtp(verifyOtpDto);
  //     const teacher = await this.teacherRepository.findOne({
  //       where: { phone: verifyOtpDto.phone },
  //     });
  //     if (!teacher) {
  //       throw new NotFoundException('Teacher topilmadi!');
  //     }
  //     const { access_token, refresh_token } = await generateToken(
  //       { id: teacher.id },
  //       this.jwtService,
  //     );
  //     await writeToCookie(refresh_token, res);
  //     return {
  //       statusCode: HttpStatus.OK,
  //       mesage: 'Teacher tizimga kirdi',
  //       data: {
  //         teacher,
  //       },
  //       token: access_token,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async logout(refresh_token: string, res: Response): Promise<object> {
    try {
      const data = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      const teacher = await this.getById(data.id);
      res.clearCookie('refresh_token');
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Teacher tizimdan chiqdi',
        data: {
          teacher,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const teachers = await this.teacherRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: {
          teachers,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const teacher = await this.teacherRepository.findByPk(id);
      if (!teacher) {
        throw new NotFoundException('Teacher topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          teacher,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const teachers = await this.teacherRepository.findAll({ offset, limit });
      const total_count = await this.teacherRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: teachers,
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

  // async newPassword(
  //   id: string,
  //   newPasswordDto: NewPasswordDto,
  // ): Promise<object> {
  //   try {
  //     const { old_password, new_password, confirm_new_password } =
  //       newPasswordDto;
  //     const teacher = await this.teacherRepository.findByPk(id);
  //     if (!teacher) {
  //       throw new NotFoundException('Teacher topilmadi!');
  //     }
  //     const is_match_pass = await compare(old_password, teacher.hashed_password);
  //     if (!is_match_pass) {
  //       throw new ForbiddenException('Eski parol mos kelmadi!');
  //     }
  //     if (new_password != confirm_new_password) {
  //       throw new ForbiddenException('Yangi parolni tasdiqlashda xatolik!');
  //     }
  //     const hashed_password = await hash(confirm_new_password, 7);
  //     const updated_info = await this.teacherRepository.update(
  //       { hashed_password },
  //       { where: { id }, returning: true },
  //     );
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: "Parol o'zgartirildi",
  //       data: {
  //         teacher: updated_info[1][0],
  //       },
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

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
  //     const updated_info = await this.teacherRepository.update(
  //       { hashed_password },
  //       { where: { id }, returning: true },
  //     );
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: "Paroli o'zgartirildi",
  //       data: {
  //         teacher: updated_info[1][0],
  //       },
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async updateProfile(
  //   id: string,
  //   updateTeacherDto: UpdateTeacherDto,
  // ): Promise<object> {
  //   try {
  //     const teacher = await this.teacherRepository.findByPk(id);
  //     if (!teacher) {
  //       throw new NotFoundException('Teacher topilmadi!');
  //     }
  //     const { phone, email, username } = updateTeacherDto;
  //     let dto = {};
  //     if (!phone) {
  //       dto = Object.assign(dto, { phone: teacher.phone });
  //     }
  //     if (!email) {
  //       dto = Object.assign(dto, { email: teacher.email });
  //     }
  //     if (!username) {
  //       dto = Object.assign(dto, { username: teacher.username });
  //     }
  //     const obj = Object.assign(updateTeacherDto, dto);
  //     const update = await this.teacherRepository.update(obj, {
  //       where: { id },
  //       returning: true,
  //     });
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: "Teacher ma'lumotlari tahrirlandi",
  //       data: {
  //         teacher: update[1][0],
  //       },
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async deleteTeacher(id: string): Promise<object> {
    try {
      const teacher = await this.teacherRepository.findByPk(id);
      if (!teacher) {
        throw new NotFoundException('Teacher topilmadi!');
      }
      teacher.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Teacher ro'yxatdan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

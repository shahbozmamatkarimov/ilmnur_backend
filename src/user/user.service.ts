import { FilesService } from '../files/files.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './models/user.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { LoginUserDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
  ) { }

  async register(registerUserDto: RegisterUserDto): Promise<object> {
    try {
      const { phone } = registerUserDto;
      const is_phone = await this.userRepository.findOne({
        where: { phone },
      });
      console.log(is_phone);
      if (is_phone) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'phone',
        };
      }

      const user = await this.userRepository.create(registerUserDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully registered!',
        data: {
          user,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async login(loginUserDto: LoginUserDto): Promise<object> {
  //   try {
  //     const { phone, password } = loginUserDto;
  //     const user = await this.userRepository.findOne({ where: { phone } });
  //     if (!user) {
  //       throw new NotFoundException('Telefon raqam yoki parol xato!');
  //     }
  //     const is_match_pass = await compare(password, user.hashed_password);
  //     if (!is_match_pass) {
  //       throw new ForbiddenException('Login yoki parol xato!');
  //     }
  //     // return this.otpService.sendOTP({ phone });
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async login(
    loginUserDto: LoginUserDto,
    res: Response,
  ): Promise<object> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: loginUserDto.user_id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { access_token, refresh_token } = await generateToken(
        { id: user.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Logged in successfully',
        data: user,
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(role: string): Promise<object> {
    try {
      const users = await this.userRepository.findAll({
        where: {
          role: {[Op.overlap]: [role],}
        }
      });
      return {
        statusCode: HttpStatus.OK,
        data: users
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getReyting(): Promise<object> {
    try {
      const users = await this.userRepository.findAll({
        order: [
          ["test_reyting", 'DESC'],
        ]
      });
      return {
        statusCode: HttpStatus.OK,
        data: users,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const users = await this.userRepository.findAll({ offset, limit });
      const total_count = await this.userRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: users,
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
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const is_match_pass = await compare(old_password, user.hashed_password);
      if (!is_match_pass) {
        throw new ForbiddenException('The old password did not match!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.userRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Parol o'zgartirildi",
        data: {
          user: updated_info[1][0],
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
  //     const updated_info = await this.userRepository.update(
  //       { hashed_password },
  //       { where: { id }, returning: true },
  //     );
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: "Paroli o'zgartirildi",
  //       data: {
  //         user: updated_info[1][0],
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
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const update = await this.userRepository.update(updateDto, {
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
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
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
      const update = await this.userRepository.update({ image: image.url }, {
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
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const test_reyting = user.test_reyting + 1;
      const update = await this.userRepository.update({ test_reyting }, {
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

  async deleteUser(id: string): Promise<object> {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Deleted successfully",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
function ILIKE(arg0: string): import("sequelize").WhereAttributeHashValue<object> {
  throw new Error('Function not implemented.');
}


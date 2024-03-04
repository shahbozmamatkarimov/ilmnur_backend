import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Variants } from './models/variants.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { VariantsDto } from './dto/variants.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class VariantsService {
  constructor(
    @InjectModel(Variants) private variantsRepository: typeof Variants,
    private readonly jwtService: JwtService,
  ) { }

  async create(variantsDto: VariantsDto): Promise<object> {
    try {
      const variants = await this.variantsRepository.create(variantsDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: variants,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(class_name: number): Promise<object> {
    try {
      const variantss = await this.variantsRepository.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM "lesson" WHERE "lesson"."variants_id" = "Variants"."id" and "lesson"."class" = ${class_name})`,
              ),
              'lessonsCount',
            ],
            [
              Sequelize.literal(`(
                SELECT SUM("video_lesson"."duration")
                FROM "lesson"
                INNER JOIN "video_lesson" ON "lesson"."id" = "video_lesson"."lesson_id"
                WHERE "lesson"."variants_id" = "Variants"."id"
                AND "lesson"."class" = '${class_name}'
              )`),
              'totalDuration',
            ],
          ],
        },
      });
      return {
        statusCode: HttpStatus.OK,
        data: variantss,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getVariantss(): Promise<object> {
    try {
      const variantss = await this.variantsRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: variantss,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const variants = await this.variantsRepository.findByPk(id);
      if (!variants) {
        throw new NotFoundException('Variants not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: variants,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkById(id: number, answer: string): Promise<object> {
    try {
      const variant = await this.variantsRepository.findByPk(id);
      if (!variant) {
        throw new NotFoundException('Variants not found');
      }
      if (variant.variants[0] == answer) {
        return [id, true];
      }
      return [id, false];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async getByTitle(title: string): Promise<object> {
  //   try {
  //     const variants = await this.variantsRepository.findOne({
  //       where: { title },
  //     });
  //     if (!variants) {
  //       throw new NotFoundException('Variants not found');
  //     }
  //     return {
  //       statusCode: HttpStatus.OK,
  //       data: variants,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const variantss = await this.variantsRepository.findAll({ offset, limit });
      const total_count = await this.variantsRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: variantss,
          pagination: {
            currentPage: page,
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

  async update(id: number, variantsDto: VariantsDto): Promise<object> {
    try {
      const variants = await this.variantsRepository.findByPk(id);
      if (!variants) {
        throw new NotFoundException('Variants not found');
      }
      const update = await this.variantsRepository.update(variantsDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          variants: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const variants = await this.variantsRepository.findByPk(id);
      if (!variants) {
        throw new NotFoundException('Variants not found');
      }
      variants.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

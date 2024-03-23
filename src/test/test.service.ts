import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tests } from './models/test.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { TestsDto } from './dto/test.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Tests) private testsRepository: typeof Tests,
    private readonly jwtService: JwtService,
  ) { }

  async create(testsDto: TestsDto): Promise<object> {
    try {
      const tests = await this.testsRepository.create(testsDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: tests,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(class_name: number): Promise<object> {
    try {
      const testss = await this.testsRepository.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM "lesson" WHERE "lesson"."tests_id" = "Tests"."id" and "lesson"."class" = ${class_name})`,
              ),
              'lessonsCount',
            ],
            [
              Sequelize.literal(`(
                SELECT SUM("video_lesson"."duration")
                FROM "lesson"
                INNER JOIN "video_lesson" ON "lesson"."id" = "video_lesson"."lesson_id"
                WHERE "lesson"."tests_id" = "Tests"."id"
                AND "lesson"."class" = '${class_name}'
              )`),
              'totalDuration',
            ],
          ],
        },
      });
      return {
        statusCode: HttpStatus.OK,
        data: testss,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTestss(): Promise<object> {
    try {
      const testss = await this.testsRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: testss,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const tests = await this.testsRepository.findByPk(id);
      if (!tests) {
        throw new NotFoundException('Tests not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: tests,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkById(id: number, answer: string): Promise<object> {
    try {
      const test = await this.testsRepository.findByPk(id);
      if (!test) {
        throw new NotFoundException('Tests not found');
      }
      if (test.tests[0] == answer) {
        return [id, true];
      }
      return [id, false];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async getByTitle(title: string): Promise<object> {
  //   try {
  //     const tests = await this.testsRepository.findOne({
  //       where: { title },
  //     });
  //     if (!tests) {
  //       throw new NotFoundException('Tests not found');
  //     }
  //     return {
  //       statusCode: HttpStatus.OK,
  //       data: tests,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const testss = await this.testsRepository.findAll({ offset, limit });
      const total_count = await this.testsRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: testss,
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

  async update(id: number, testsDto: TestsDto): Promise<object> {
    try {
      const tests = await this.testsRepository.findByPk(id);
      if (!tests) {
        throw new NotFoundException('Tests not found');
      }
      const update = await this.testsRepository.update(testsDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          tests: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const tests = await this.testsRepository.findByPk(id);
      if (!tests) {
        throw new NotFoundException('Tests not found');
      }
      tests.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

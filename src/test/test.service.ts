import { CheckDto } from './dto/check.dto';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Test } from './models/test.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { TestDto } from './dto/test.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Sequelize } from 'sequelize-typescript';
import { Variants } from '../variants/models/variants.models';
import { VariantsService } from 'src/variants/variants.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test) private testRepository: typeof Test,
    private readonly variantsService: VariantsService,
    private readonly studentService: StudentService,
    // private readonly jwtService: JwtService,
  ) { }

  async create(testDto: TestDto): Promise<object> {
    try {
      const test = await this.testRepository.create(testDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: test,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(class_name: number): Promise<object> {
    try {
      const tests = await this.testRepository.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM "lesson" WHERE "lesson"."test_id" = "Test"."id" and "lesson"."class" = ${class_name})`,
              ),
              'lessonsCount',
            ],
            [
              Sequelize.literal(`(
                SELECT SUM("video_lesson"."duration")
                FROM "lesson"
                INNER JOIN "video_lesson" ON "lesson"."id" = "video_lesson"."lesson_id"
                WHERE "lesson"."test_id" = "Test"."id"
                AND "lesson"."class" = '${class_name}'
              )`),
              'totalDuration',
            ],
          ],
        },
      });
      return {
        statusCode: HttpStatus.OK,
        data: tests,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTests(): Promise<object> {
    try {
      const tests = await this.testRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: tests,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const test = await this.testRepository.findByPk(id, {
        include: [{ model: Variants }],
      });
      if (!test) {
        throw new NotFoundException('Test not found');
      }

      // Get the variants and randomize their order
      const variants = await test.get('variants');
      const randomizedVariants = this.shuffle(variants).map(variant => {
        const randomizedOptions = this.shuffle(variant.get('variants'));
        return {
          ...variant.toJSON(),
          variants: randomizedOptions,
        };
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          ...test.toJSON(),
          variants: randomizedVariants,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkAnswers(student_id: number, checkDto: CheckDto): Promise<object> {
    const { answers } = checkDto;
    try {
      const results = {};
      let student: any;
      let res: object, id: number, answer: string;
      for (let i of answers) {
        id = +i[0];
        answer = i[1];
        res = await this.variantsService.checkById(id, answer);
        results[res[0]] = res[1];
      }
      let ball = 0;
      for (let i in results) {
        if (results[i]) {
          ball += 1;
        }
      }
      console.log(ball)
      const percentage = (ball / Object.keys(results)?.length) * 100;

      if (percentage >= 70) {
        student = await this.studentService.updateTestReyting(student_id);
      }

      console.log(percentage)

      return {
        statusCode: HttpStatus.OK,
        data: {
          results,
          ball: [percentage, ball],
          student,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async getByTitle(title: string): Promise<object> {
  //   try {
  //     const test = await this.testRepository.findOne({
  //       where: { title },
  //     });
  //     if (!test) {
  //       throw new NotFoundException('Test not found');
  //     }
  //     return {
  //       statusCode: HttpStatus.OK,
  //       data: test,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const tests = await this.testRepository.findAll({ offset, limit });
      const total_count = await this.testRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: tests,
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

  async update(id: number, testDto: TestDto): Promise<object> {
    try {
      const test = await this.testRepository.findByPk(id);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      const update = await this.testRepository.update(testDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          test: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const test = await this.testRepository.findByPk(id);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      test.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Function to shuffle an array
  private shuffle(array: any[]): any[] {
    const shuffledArray = [...array];
    const data = []
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }
}

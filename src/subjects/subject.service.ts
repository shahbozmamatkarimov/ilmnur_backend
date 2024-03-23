import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subject } from './models/subject.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { SubjectDto } from './dto/subject.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject) private subjectRepository: typeof Subject,
    private readonly jwtService: JwtService,
  ) { }

  async create(subjectDto: SubjectDto): Promise<object> {
    try {
      const { title } = subjectDto;
      const exist = await this.subjectRepository.findOne({
        where: { title },
      });
      if (exist) {
        throw new BadRequestException('Already created');
      }
      const subject = await this.subjectRepository.create(subjectDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: subject,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(class_name: number): Promise<object> {
    const class_names = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let subjects: any;
    let data: any = []
    try {
      for (let i of class_names) {
        subjects = await this.subjectRepository.findAll({
          attributes: {
            include: [
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM "lesson" WHERE "lesson"."subject_id" = "Subject"."id" and "lesson"."class" = ${i})`,
                ),
                'lessonsCount',
              ],
              [
                Sequelize.literal(`COALESCE(
                  (
                      SELECT SUM("uploaded"."duration")
                      FROM "lesson"
                      INNER JOIN "video_lesson" ON "lesson"."id" = "video_lesson"."lesson_id"
                      INNER JOIN "uploaded" ON "video_lesson"."video_id" = "uploaded"."id"
                      WHERE "lesson"."subject_id" = "Subject"."id"
                      AND "lesson"."class" = '${i}'
                  ),
                  0
              )`),
                'totalDuration',
              ],
            ],
          },
        });
        if (data.length) {
          for (let i in data[0]) {
            data[0][i].dataValues.totalDuration = String(data[0][i].dataValues.totalDuration).split(",")
            data[0][i].dataValues.lessonsCount = String(data[0][i].dataValues.lessonsCount).split(",")
            data[0][i].dataValues.totalDuration.push(subjects[i].dataValues.totalDuration)
            data[0][i].dataValues.lessonsCount.push(subjects[i].dataValues.lessonsCount)
          }
        } else {
          data.push(subjects);
        }
      }
      return {
        statusCode: HttpStatus.OK,
        data: data[0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSubjects(): Promise<object> {
    try {
      const subjects = await this.subjectRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: subjects,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const subject = await this.subjectRepository.findByPk(id);
      if (!subject) {
        throw new NotFoundException('Subject not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: subject,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByTitle(title: string): Promise<object> {
    try {
      const subject = await this.subjectRepository.findOne({
        where: { title },
      });
      if (!subject) {
        throw new NotFoundException('Subject not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: subject,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const subjects = await this.subjectRepository.findAll({ offset, limit });
      const total_count = await this.subjectRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: subjects,
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

  async update(id: number, subjectDto: SubjectDto): Promise<object> {
    try {
      const subject = await this.subjectRepository.findByPk(id);
      if (!subject) {
        throw new NotFoundException('Subject not found');
      }
      const update = await this.subjectRepository.update(subjectDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          subject: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const subject = await this.subjectRepository.findByPk(id);
      if (!subject) {
        throw new NotFoundException('Subject not found');
      }
      subject.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

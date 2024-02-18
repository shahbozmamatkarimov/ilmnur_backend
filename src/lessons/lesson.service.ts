import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Lesson } from './models/lesson.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { LessonDto } from './dto/lesson.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Video_lesson } from '../video_lesson/models/video_lesson.models';
import { SubjectService } from '../subjects/subject.service';
import { Op } from 'sequelize';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson) private lessonRepository: typeof Lesson,
    private readonly jwtService: JwtService,
    private readonly subjectService: SubjectService,
  ) {}

  async create(lessonDto: LessonDto): Promise<object> {
    try {
      const { title } = lessonDto;
      const exist = await this.lessonRepository.findOne({
        where: { title },
      });
      if (exist) {
        throw new BadRequestException('Already created');
      }
      const lesson = await this.lessonRepository.create(lessonDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: lesson,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(class_name: number, subject: string): Promise<object> {
    try {
      const subject_id: any = await this.subjectService.getByTitle(subject);
      const lessons = await this.lessonRepository.findAll({
        where: { class: class_name, subject_id: subject_id.data.id },
        include: [{ model: Video_lesson, attributes: ['duration'] }],
        order: [['id', 'ASC']],
      });
      return {
        statusCode: HttpStatus.OK,
        data: lessons,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number, class_name: number): Promise<object> {
    try {
      const lesson = await this.lessonRepository.findOne({
        where: { [Op.and]: [{ class: class_name }, { id: id }] },
        include: [{ model: Video_lesson }],
      });
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: lesson,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const lessons = await this.lessonRepository.findAll({ offset, limit });
      const total_count = await this.lessonRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: lessons,
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

  async update(id: number, lessonDto: LessonDto): Promise<object> {
    try {
      const lesson = await this.lessonRepository.findByPk(id);
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      const update = await this.lessonRepository.update(lessonDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          lesson: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const lesson = await this.lessonRepository.findByPk(id);
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      lesson.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

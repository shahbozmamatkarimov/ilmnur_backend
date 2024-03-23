import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Video_lesson } from './models/video_lesson.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { Video_lessonDto } from './dto/video_lesson.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Sequelize } from 'sequelize-typescript';
import { FilesService } from '../files/files.service';
import { videoDuration } from '@numairawan/video-duration';
import { Lesson } from '../lessons/models/lesson.models';
import { Uploaded } from 'src/uploaded/models/uploaded.models';

@Injectable()
export class Video_lessonService {
  constructor(
    @InjectModel(Video_lesson)
    private video_lessonRepository: typeof Video_lesson,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
  ) {}

  async create(video_lessonDto: Video_lessonDto): Promise<object> {
    console.log(video_lessonDto)
    try {
      const videoLesson = await this.video_lessonRepository.findOne({
        where: { lesson_id: video_lessonDto.lesson_id },
      });
      if (videoLesson) {
        throw new BadRequestException("Already created")
      }
      const video_lesson =
        await this.video_lessonRepository.create(video_lessonDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: video_lesson,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const video_lessons = await this.video_lessonRepository.findAll({
        include: [{ model: Uploaded }],
      });
      return {
        statusCode: HttpStatus.OK,
        data: video_lessons,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const video_lesson = await this.video_lessonRepository.findByPk(id, {
        include: [{ model: Lesson, attributes: ['title'] }],
      });
      if (!video_lesson) {
        throw new NotFoundException('Video_lesson not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: video_lesson,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const video_lessons = await this.video_lessonRepository.findAll({
        offset,
        limit,
      });
      const total_count = await this.video_lessonRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: video_lessons,
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

  async update(id: number, video_lessonDto: Video_lessonDto): Promise<object> {
    try {
      const video_lesson = await this.video_lessonRepository.findByPk(id);
      if (!video_lesson) {
        throw new NotFoundException('Video_lesson not found');
      }
      const update = await this.video_lessonRepository.update(video_lessonDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          video_lesson: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const video_lesson = await this.video_lessonRepository.findByPk(id);
      if (!video_lesson) {
        throw new NotFoundException('Video_lesson not found');
      }
      video_lesson.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

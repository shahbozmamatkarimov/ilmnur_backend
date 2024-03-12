import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Class } from './models/class.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ClassDto } from './dto/class.dto';
import { SubjectService } from '../subjects/subject.service';
import { Op } from 'sequelize';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class) private classRepository: typeof Class,
    private readonly jwtService: JwtService,
    private readonly subjectService: SubjectService,
  ) { }

  async create(classDto: ClassDto): Promise<object> {
    try {
      const { class_number, name } = classDto;
      const exist = await this.classRepository.findOne({
        where: { class_number, name },
      });
      if (exist) {
        throw new BadRequestException('Already created');
      }
      const data = await this.classRepository.create(classDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const classs = await this.classRepository.findAll({
        order: [['class_number', 'ASC'], ['name', 'ASC']],
      });
      return {
        statusCode: HttpStatus.OK,
        data: classs,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number, class_name: number): Promise<object> {
    try {
      const classes = await this.classRepository.findOne({
        // where: { [Op.and]: [{ class: class_name }, { id: id }] },
      });
      if (!classes) {
        throw new NotFoundException('Class not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: classes,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const classs = await this.classRepository.findAll({ offset, limit });
      const total_count = await this.classRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: classs,
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

  async update(id: number, classDto: ClassDto): Promise<object> {
    try {
      const classes = await this.classRepository.findByPk(id);
      if (!classes) {
        throw new NotFoundException('Class not found');
      }
      const update = await this.classRepository.update(classDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          class: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const classes = await this.classRepository.findByPk(id);
      if (!classes) {
        throw new NotFoundException('Class not found');
      }
      classes.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

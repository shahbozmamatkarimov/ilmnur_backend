import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Uploaded } from './models/uploaded.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UploadedDto } from './dto/uploaded.dto';
import { Op } from 'sequelize';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UploadedService {
  constructor(
    @InjectModel(Uploaded) private uploadedRepository: typeof Uploaded,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
  ) {}

  async create(source: any, uploadedDto: UploadedDto) {
    try {
      const file_data: any = await this.fileService.createFile(source, uploadedDto.file_type);
      const data = await this.uploadedRepository.create({
        public_id: file_data.public_id,
        duration: file_data.duration?Math.floor(file_data.duration): null,
        url: file_data.url,
        is_active: uploadedDto.is_active ? true : false,
        file_type: uploadedDto.file_type,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data,
      };
    } catch (error) {
      return { statusCode: HttpStatus.BAD_REQUEST, error: error.message };
    }
  }

  async getAll(): Promise<object> {
    try {
      const uploaded = await this.uploadedRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: uploaded,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(public_id: number): Promise<object> {
    try {
      const uploaded = await this.uploadedRepository.findOne({
        where: { public_id },
      });
      if (!uploaded) {
        throw new NotFoundException('Uploaded not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: uploaded,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const classs = await this.uploadedRepository.findAll({ offset, limit });
      const total_count = await this.uploadedRepository.count();
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

  async update(id: number, uploadedDto: UploadedDto): Promise<object> {
    try {
      const uploaded = await this.uploadedRepository.findByPk(id);
      if (!uploaded) {
        throw new NotFoundException('Uploaded not found');
      }
      const update = await this.uploadedRepository.update(uploadedDto, {
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
      const uploaded = await this.uploadedRepository.findByPk(id);
      if (!uploaded) {
        throw new NotFoundException('Uploaded not found');
      }
      uploaded.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

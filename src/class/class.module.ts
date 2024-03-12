import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from './models/class.models';
import { SubjectModule } from '../subjects/subject.module';

@Module({
  imports: [SequelizeModule.forFeature([Class]), SubjectModule],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}

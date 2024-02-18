import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lesson } from './models/lesson.models';
import { SubjectModule } from '../subjects/subject.module';

@Module({
  imports: [SequelizeModule.forFeature([Lesson]), SubjectModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}

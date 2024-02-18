import { Module } from '@nestjs/common';
import { Video_lessonService } from './video_lesson.service';
import { Video_lessonController } from './video_lesson.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Video_lesson } from './models/video_lesson.models';
import { FilesModule } from '../files/files.module';
import { LessonModule } from '../lessons/lesson.module';

@Module({
  imports: [SequelizeModule.forFeature([Video_lesson]), FilesModule, LessonModule],
  controllers: [Video_lessonController],
  providers: [Video_lessonService],
})
export class Video_lessonModule {}

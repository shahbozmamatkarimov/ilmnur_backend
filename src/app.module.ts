import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { FilesModule } from './files/files.module';
import { AdminModule } from './admin/admin.module';
import { TeacherModule } from './teachers/teacher.module';
import { ChatModule } from './chat/chat.module';
import { LessonModule } from './lessons/lesson.module';
import { SubjectModule } from './subjects/subject.module';
import { Video_lessonModule } from './video_lesson/video_lesson.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASS),
      database: process.env.PG_DB,
      autoLoadModels: true,
      logging: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'static'),
    }),
    JwtModule.register({ global: true }),
    FilesModule,
    AdminModule,
    TeacherModule,
    ChatModule,
    LessonModule,
    SubjectModule,
    Video_lessonModule,
    StudentModule,
  ],
})
export class AppModule {}

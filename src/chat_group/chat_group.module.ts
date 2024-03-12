import { Module } from '@nestjs/common';
import { ChatGroupService } from './chat_group.service';
import { ChatGroupController } from './chat_group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatGroup } from './models/chat_group.models';
import { SubjectModule } from '../subjects/subject.module';

@Module({
  imports: [SequelizeModule.forFeature([ChatGroup]), SubjectModule],
  controllers: [ChatGroupController],
  providers: [ChatGroupService],
})
export class ChatGroupModule {}

import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from '../files/files.module';
@Module({
  imports: [SequelizeModule.forFeature([Chat]), FilesModule],
  controllers: [ChatController],
  providers: [ChatService, ChatController],
  exports: [ChatService],
})
export class ChatModule {}

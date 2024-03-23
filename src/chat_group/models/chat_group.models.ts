import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ChatGroupType } from '../dto/chat_group.dto';
import { Chat } from 'src/chat/models/chat.model';

interface ChatGroupAttributes {
  title: string;
  chat_type: ChatGroupType;
}

@Table({ tableName: 'chatgroup' })
export class ChatGroup extends Model<ChatGroup, ChatGroupAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column(
    DataType.ENUM({
      values: Object.keys(ChatGroupType),
    }),
  )
  chat_type: ChatGroupType;

  @HasMany(() => Chat, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  chats: Chat[];
}
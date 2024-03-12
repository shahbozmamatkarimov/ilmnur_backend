import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ChatGroup } from 'src/chat_group/models/chat_group.models';
import { User } from 'src/user/models/user.models';

interface ChatAttr {
  icon: number;
  text: string;
  file_type: object;
  user_id: number;
  chatgroup_id: number;
  file: string;
}

@Table({ tableName: 'chat' })
export class Chat extends Model<Chat, ChatAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  icon: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  text: string;

  @Column({ type: DataType.JSON })
  file_type: object;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User[];

  @ForeignKey(() => ChatGroup)
  @Column({
    type: DataType.INTEGER,
  })
  chatgroup_id: number;

  @BelongsTo(() => ChatGroup)
  chatgroups: ChatGroup[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file: string;
}

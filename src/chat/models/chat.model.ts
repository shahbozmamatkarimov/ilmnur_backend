import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

interface ChatAttr {
  icon: number;
  text: string;
  file_type: object;
  user_id: number;
  recipient_id: number;
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

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  recipient_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file: string;
}

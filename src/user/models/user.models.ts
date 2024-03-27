import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Chat } from 'src/chat/models/chat.model';

interface UserAttributes {
  full_name: string;
  phone: string;
  role: string[];
  subjects: string[];
  class: string[][];
  region: string;
  district: string;
  school_number: number;
  user_status: string;
  is_online: boolean;
}

export enum UserStatus {
  pending = 'pending',
  inprogress = 'inprogress',
  logged = 'logged',
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  class: string[][];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  role: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  subjects: string[];

  @Column(
    DataType.ENUM({
      values: Object.keys(GenderType),
    }),
  )
  gender: GenderType;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  get_answered: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  new_task: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  chat_messages: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  test_reyting: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  region: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  district: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  school_number: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hashed_password: string;

  @HasMany(() => Chat, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  chats: Chat[];

  @Column({
    type: DataType.ENUM({
      values: Object.keys(UserStatus),
    }),
    defaultValue: UserStatus.pending,
  })
  user_status: UserStatus;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_online: boolean;
}

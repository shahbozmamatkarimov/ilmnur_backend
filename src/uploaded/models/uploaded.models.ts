import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Video_lesson } from 'src/video_lesson/models/video_lesson.models';

interface UploadedAttributes {
  public_id: string;
  duration: number;
  is_active: boolean;
  file_type: string;
  url: string;
}

@Table({ tableName: 'uploaded' })
export class Uploaded extends Model<Uploaded, UploadedAttributes> {
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
  public_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @HasMany(() => Video_lesson, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  video_lesson: Video_lesson[];
}

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Subject } from '../../subjects/models/subject.models';
import { Video_lesson } from '../../video_lesson/models/video_lesson.models';

interface LessonAttributes {
  title: string;
  subject_id: number;
  class: number;
}

@Table({ tableName: 'lesson' })
export class Lesson extends Model<Lesson, LessonAttributes> {
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

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  class: number;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
  })
  subject_id: number;

  @BelongsTo(() => Subject)
  subjects: Subject[];

  @HasMany(() => Video_lesson, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  video_lesson: Video_lesson[];
}

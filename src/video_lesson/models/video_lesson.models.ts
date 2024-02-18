import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Lesson } from '../../lessons/models/lesson.models';

interface Video_lessonAttributes {
  lesson_id: number;
  video: string;
  duration: number;
  content: string;
}

@Table({ tableName: 'video_lesson' })
export class Video_lesson extends Model<Video_lesson, Video_lessonAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Lesson)
  @Column({
    type: DataType.INTEGER,
  })
  lesson_id: number;

  @BelongsTo(() => Lesson)
  lessons: Lesson[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  video: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;
}

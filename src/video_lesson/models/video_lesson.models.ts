import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Lesson } from '../../lessons/models/lesson.models';
import { Uploaded } from 'src/uploaded/models/uploaded.models';

interface Video_lessonAttributes {
  lesson_id: number;
  video_id: number;
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

  @ForeignKey(() => Uploaded)
  @Column({
    type: DataType.INTEGER,
  })
  video_id: number;

  @BelongsTo(() => Uploaded)
  // @Column({type: DataType.JSON})
  video: Uploaded[];
  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;
}

import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Lesson } from '../../lessons/models/lesson.models';

interface SubjectAttributes {
  title: string;
}

@Table({ tableName: 'subject' })
export class Subject extends Model<Subject, SubjectAttributes> {
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
  
  @HasMany(() => Lesson, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  lessons: Lesson[];
}

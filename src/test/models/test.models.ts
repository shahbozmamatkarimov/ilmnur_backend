import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Lesson } from '../../lessons/models/lesson.models';
import { Variants } from '../../variants/models/variants.models';

interface TestAttributes {
  title: string;
  lesson_id: number;
}

@Table({ tableName: 'test' })
export class Test extends Model<Test, TestAttributes> {
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

  @HasMany(() => Variants, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  variants: Variants[];

  @ForeignKey(() => Lesson)
  @Column({
    type: DataType.INTEGER,
  })
  lesson_id: number;

  @BelongsTo(() => Lesson)
  lessons: Lesson[];
}

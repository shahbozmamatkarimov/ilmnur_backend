import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Lesson } from '../../lessons/models/lesson.models';
import { Test } from '../../test/models/test.models';

interface VariantsAttributes {
  test_id: number;
  question: string;
  variants: string[];
}

@Table({ tableName: 'variants' })
export class Variants extends Model<Variants, VariantsAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Test)
  @Column({
    type: DataType.INTEGER,
  })
  test_id: number;

  @BelongsTo(() => Test)
  tests: Test[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  question: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  variants: string[];
}

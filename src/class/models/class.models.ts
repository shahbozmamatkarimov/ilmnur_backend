import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface ClassAttributes {
  class_number: number;
  name: string;
}

@Table({ tableName: 'class' })
export class Class extends Model<Class, ClassAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  class_number: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}

import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface StudentAttributes {
  full_name: string;
  phone: string;
  role: string;
  subject: string;
}

@Table({ tableName: 'student' })
export class Student extends Model<Student, StudentAttributes> {
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
    type: DataType.STRING,
    allowNull: true,
  })
  subject: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  class: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role: string;
}

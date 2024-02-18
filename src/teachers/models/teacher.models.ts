import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface TeacherAttributes {
  full_name: string;
  phone: string;
  role: string;
  subject: string;
}

@Table({ tableName: 'teacher' })
export class Teacher extends Model<Teacher, TeacherAttributes> {
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
    allowNull: false,
  })
  role: string;
}

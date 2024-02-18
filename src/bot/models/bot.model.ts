import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface BotAttr {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: boolean;
}

@Table({ tableName: 'bot' })
export class Bot extends Model<Bot, BotAttr> {
    @ApiProperty({ example: 123456789, description: 'user_id' })
    @Column({ type: DataType.BIGINT, primaryKey: true, allowNull: false })
    user_id: number;

    @ApiProperty({ example: "johndoe", description: 'username' })
    @Column({ type: DataType.STRING })
    username: string;

    @ApiProperty({ example: "John", description: 'first name' })
    @Column({ type: DataType.STRING })
    first_name: string;

    @ApiProperty({ example: "Doe", description: 'last name' })
    @Column({ type: DataType.STRING })
    last_name: string;

    @ApiProperty({ example: "+998901234567", description: 'phone number' })
    @Column({ type: DataType.STRING })
    phone_number: string;

    @ApiProperty({ example: "user active", description: 'status' })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    status: boolean;
}
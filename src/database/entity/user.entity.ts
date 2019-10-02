import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Exclude} from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    @Exclude()
    password: string;
}

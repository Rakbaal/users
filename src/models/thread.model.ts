import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Thread extends BaseEntity {

    @PrimaryGeneratedColumn()
    _id? : number

    @Column()
    owner? : number

    @Column({unique: true})
    name? : string

    @Column("timestamp",{default: () => "NOW()"})
    createAt? : Date

}
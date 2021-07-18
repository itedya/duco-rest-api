import {Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import Jwt from "@/app/entities/Jwt";

@Entity("users")
class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        unique: true
    })
    username: string;

    @Column({
        type: "varchar",
        select: false
    })
    password: string;

    @Column({
        type: "varchar",
        unique: true,
        select: false
    })
    email: string;

    @Column({
        type: "real",
        default: 0
    })
    balance: number;

    @OneToMany(() => Jwt, jwt => jwt.user)
    jwt_tokens: Jwt[];
}

export default User;
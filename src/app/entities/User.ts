import {Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import Jwt from "@/app/entities/Jwt";
import Transaction from "@/app/entities/Transaction";
import Miner from "@/app/entities/Miner";

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

    @OneToMany(() => Transaction, transaction => transaction.from_user)
    transactions_from: Transaction[];

    @OneToMany(() => Transaction, transaction => transaction.to_user)
    transactions_to: Transaction[];

    @OneToMany(() => Miner, miner => miner.user)
    miners: Miner[];
}

export default User;
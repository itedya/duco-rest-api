import {Column, Entity, ManyToOne} from "typeorm";
import User from "@/app/entities/User";

@Entity("transactions")
class Transaction {

    @Column({
        primary: true,
        type: "varchar"
    })
    hash: string;

    @Column({type: "int"})
    from_user_id: number;

    @Column({type: "int"})
    to_user_id: number;

    @Column({type: "real"})
    amount: number;

    @Column({type: "datetime"})
    timestamp: Date;

    @ManyToOne(() => User, user => user.transactions_from)
    from_user: User;

    @ManyToOne(() => User, user => user.transactions_to)
    to_user: User;
}

export default Transaction;

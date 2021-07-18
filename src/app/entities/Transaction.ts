import {Column, Entity} from "typeorm";

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
}

export default Transaction;

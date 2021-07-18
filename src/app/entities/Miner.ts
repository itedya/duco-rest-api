import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "@/app/entities/User";

@Entity("miners")
class Miner {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ type: "varchar" })
    thread_id: string;

    @Column({ type: "real", default: 0 })
    hashrate: number;

    @Column({ type: "real" })
    sharetime: number;

    @Column({ type: "int" })
    accepted: number;

    @Column({ type: "int" })
    rejected: number;

    @Column({ type: "int" })
    diff: number;

    @Column({ type: "varchar" })
    software: string;

    @Column({ type: "varchar" })
    identifier: string;

    @Column({ type: "varchar", select: false })
    user_id: string;

    @Column({ type: "varchar" })
    algorithm: string;

    @ManyToOne(() => User, user => user.miners)
    user: User;
}

export default Miner;
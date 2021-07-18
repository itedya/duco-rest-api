import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "@/app/entities/User";

@Entity("access_tokens")
class Jwt {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", unique: true})
    token: string;

    @Column({type: "boolean", default: false})
    revoked: boolean;

    @ManyToOne(() => User, user => user.jwt_tokens)
    user: User;

    @Column({ type: "varchar", select: false })
    user_id: string;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;
}

export default Jwt
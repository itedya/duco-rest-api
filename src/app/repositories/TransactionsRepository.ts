import { getConnection } from "typeorm";
import Transaction from "@/app/entities/Transaction";

export default getConnection().getRepository(Transaction);
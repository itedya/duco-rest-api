import { getConnection } from "typeorm";
import Miner from "@/app/entities/Miner";

export default getConnection().getRepository(Miner);
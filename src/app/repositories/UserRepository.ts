import { getConnection } from 'typeorm';
import User from "@/app/entities/User";

export default getConnection().getRepository(User);
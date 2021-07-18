const { getConnection } = require('typeorm');
import Jwt from "@/app/entities/Jwt";

export default getConnection().getRepository(Jwt);
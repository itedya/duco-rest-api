import {Request as ExpressRequest} from "express";
import {JwtPayload} from "jsonwebtoken";

interface Request extends ExpressRequest {
    token?: string;
    user?: JwtPayload;
}

export default Request;
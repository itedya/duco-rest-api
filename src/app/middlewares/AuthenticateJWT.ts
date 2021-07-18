import authenticateJWT from 'jsonwebtoken';
import {NextFunction, Response} from "express";
import Request from "@/interfaces/Request";
import JwtRepository from "@/app/repositories/JwtRepository";

export default (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({errors: [{msg: "Unauthenticated", location: "headers"}]})
    }

    // TODO: Check wtf is going on here
    // @ts-ignore
    authenticateJWT.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({errors: [{msg: "Unauthenticated", location: "headers"}]});
        }

        let tokenFromDB = await JwtRepository.createQueryBuilder()
            .where({token})
            .getOneOrFail();

        if (tokenFromDB.revoked) {
            return res.status(401).json({errors: [{msg: "Unauthenticated", location: "headers"}]});
        }

        req.token = token;
        req.user = user;

        next();
    })
}
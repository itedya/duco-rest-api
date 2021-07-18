import {Response} from "express";
import Request from "@/interfaces/Request";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserRepository from '@/app/repositories/UserRepository';
import JwtRepository from '@/app/repositories/JwtRepository';

const getUser = async (req: Request, res: Response) => {
    try {
        const user = await UserRepository.findOneOrFail({
            where: {id: req.user!.id},
            relations: [
                'transactions_from',
                'transactions_to'
            ]
        });

        return res.json({result: user});
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const login = async (req: Request, res: Response) => {
    try {
        let {login, password} = req.body;

        const user = await UserRepository.createQueryBuilder()
            .select(['*'])
            .where("username = :login", {login})
            .orWhere("email = :login", {login})
            .getRawOne();

        if (!user) {
            return res.status(400).json({errors: [{msg: "User with this credentials doesn't exist!"}]});
        }

        const comparePasswords = bcrypt.compareSync(password, user.password);

        if (!comparePasswords) {
            return res.status(400).json({errors: [{msg: "User with this credentials doesn't exist!"}]});
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET!, {
            expiresIn: parseInt(process.env.JWT_EXPIRATION!)
        })

        if (!await JwtRepository.findOne({where: {token}})) {
            await JwtRepository.save({token, user_id: user.id})
        }

        delete user.password

        return res.json({
            result: {
                token,
                user
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const register = async (req: Request, res: Response) => {
    try {
        let {username, password, email} = req.body

        password = bcrypt.hashSync(password, parseInt(process.env.BRYPT_ROUNDS!))

        const user = await UserRepository.save({username, password, email});

        return res.json({
            result: {id: user.id, username, balance: user.balance}
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const revokeAllTokens = async (req: Request, res: Response) => {
    try {
        let tokens = await JwtRepository.createQueryBuilder()
            .where("user_id = :id", {id: req.user!.id})
            .getMany()

        for (const i in tokens) {
            tokens[i] = await JwtRepository.save({
                ...tokens[i],
                revoked: true
            })
            delete tokens[i].id
        }

        return res.json({
            result: tokens
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const revokeToken = async (req: Request, res: Response) => {
    try {
        let token = await JwtRepository.findOneOrFail({where: {token: req.token}})

        token = await JwtRepository.save({
            ...token,
            revoked: true
        })

        delete token.id

        return res.json({
            result: token
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

export = {
    getUser,
    login,
    register,
    revokeToken,
    revokeAllTokens
}
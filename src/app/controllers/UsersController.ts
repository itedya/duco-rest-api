import {Response} from "express";
import bcrypt from 'bcrypt';
import UserRepository from "@/app/repositories/UserRepository";
import AddPaginationToBody from "@/app/middlewares/AddPaginationToBody";

import Request from "@/interfaces/Request";
import ResultBody from "@/interfaces/ResultBody";
import User from "@/app/entities/User";

const getCountOfUsers = async () => await UserRepository.count();

const getUsers = async (req: Request, res: Response) => {
    try {
        let body: ResultBody;

        const count = await getCountOfUsers();

        try {
            body = {
                result: {},
                ...AddPaginationToBody(count, req)
            }
        } catch (e) {
            return res.status(400).json(e);
        }

        const page = parseInt(<string>req.query.page);
        const per_page = parseInt(<string>req.query.per_page);

        body.result = await UserRepository.createQueryBuilder()
            .offset(page * per_page)
            .limit(per_page)
            .getMany();

        return res.json(body);
    } catch (e) {
        console.log(e);
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        let body: ResultBody;
        const id = req.params.id;

        try {
            body = {
                result: await UserRepository.findOneOrFail({
                    where: {id},
                    relations: [
                        'transactions_from',
                        'transactions_to'
                    ]
                })
            }
        } catch (e) {
            if (e.name === 'EntityNotFound') {
                return res.status(400).json({
                    errors: [{
                        msg: "User with this id doesn't exist!",
                        param: "id",
                        location: "params"
                    }]
                });
            } else {
                throw e
            }
        }

        return res.json(body);
    } catch (e) {
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {username, email} = req.body;

        if (id !== req.user!.id) {
            return res.status(400).json({
                errors: [{
                    msg: "You can't edit somebody's else data",
                    location: "params",
                    param: "id"
                }]
            });
        }

        await UserRepository.createQueryBuilder()
            .update()
            .set({username, email})
            .where({id})
            .execute();

        let user = await UserRepository.findOneOrFail({where: {id}});

        return res.json({
            result: user
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const resetPassword = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {old_password, new_password} = req.body;

        let user: User;

        try {
            user = await UserRepository.findOneOrFail({select: ["id", "password"], where: {id}});
        } catch (e) {
            if (e.name === 'EntityNotFound') {
                return res.status(400).json({errors: [{msg: "User doesn't exist", param: "id", location: "params"}]});
            } else {
                throw e
            }
        }

        if (id !== req.user!.id) {
            return res.status(400).json({
                errors: [{
                    msg: "You can't edit somebody's else data",
                    location: "params",
                    param: "id"
                }]
            });
        }


        const compare = bcrypt.compareSync(old_password, user.password);

        if (!compare) {
            return res.status(400).json({
                errors: [{
                    msg: "Old password doesn't match",
                    location: "body",
                    param: "old_password"
                }]
            });
        }

        const password = bcrypt.hashSync(new_password, parseInt(process.env.BRYPT_ROUNDS!))

        await UserRepository.save({
            ...user,
            password
        })

        return res.json({
            result: "OK"
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

export = {
    getUsers,
    getCountOfUsers,
    getUserById,
    updateUser,
    resetPassword
}
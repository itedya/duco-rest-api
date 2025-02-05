import Request from "@/interfaces/Request";
import {Response} from "express";
import ResultBody from "@/interfaces/ResultBody";

import TransactionsRepository from "@/app/repositories/TransactionsRepository";
import AddPaginationToBody from "@/app/middlewares/AddPaginationToBody";

const getTransactionsCount = async () => await TransactionsRepository.count();

const getTransactions = async (req: Request, res: Response) => {
    try {
        let body: ResultBody;

        const count = await getTransactionsCount();

        try {
            body = {
                result: {},
                ...AddPaginationToBody(count, req)
            };
        } catch (e) {
            return res.status(400).json(e);
        }

        const page = parseInt(<string>req.query.page);
        const per_page = parseInt(<string>req.query.per_page);

        body.result = await TransactionsRepository.createQueryBuilder()
            .offset(page * per_page)
            .limit(per_page)
            .getMany();

        return res.json(body);
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const getTransactionByHash = async (req: Request, res: Response) => {
    const {hash} = req.params

    try {
        let transaction;

        try {
            transaction = await TransactionsRepository.findOneOrFail({
                select: ['hash', 'amount', 'timestamp'],
                where: {hash},
                relations: ['from_user', 'to_user']
            })
        } catch (e) {
            if (e.name === "EntityNotFound") {
                return res.status(400).json({
                    errors: [{
                        msg: "Transaction with this hash doesn't exist!",
                        param: "hash",
                        location: "params"
                    }]
                })
            } else {
                throw e
            }
        }

        return res.json({ result: transaction })
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

export = {
    getTransactions,
    getTransactionByHash
}
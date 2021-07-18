import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import fs from 'fs';

dotenv.config();
import {createConnection} from "typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import Request from "@/interfaces/Request";

const app = express();

app.use(morgan((tokens, req: Request, res) => {
    const date = new Date().toLocaleDateString('pl-PL', {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const ip = req.ip;
    const contentLength = tokens.res(req, res, 'content-length');
    const responseTime = `${tokens['response-time'](req, res)}ms`
    const userId = req.user ? req.user.id : "NOT_LOGGED_IN"

    return `[${date}] | ${method} ${status} ${url} | IP ${ip} | ${contentLength} - ${responseTime} | USER_ID ${userId}`;
}, {
    stream: fs.createWriteStream('access.log', { flags: 'a' })
}))

createConnection({
    type: "sqlite",
    database: process.env.TYPEORM_DATABASE!,
    entities: [
        process.env.TYPEORM_ENTITIES!
    ],
    namingStrategy: new SnakeNamingStrategy()
})
    .then(() => {
        const indexRouter = require("@/routes");
        const authRouter = require("@/routes/auth");
        const usersRouter = require("@/routes/users");
        const transactionsRouter = require("@/routes/transactions");
        const minersRouter = require("@/routes/miners");

        console.log(`Starting server...`);

        app.use(express.json());
        app.use(express.urlencoded({extended: false}));

        app.use('/', indexRouter);
        app.use('/auth', authRouter);
        app.use('/users', usersRouter);
        app.use('/transactions', transactionsRouter);
        app.use('/miners', minersRouter);

        app.listen(3000, () => {
            console.log(`Server started! Listening on :3000`);
        })
    })

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
import {createConnection} from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const app = express();

app.use(morgan((tokens, req, res) => {
    return `${tokens.method(req, res)} ${tokens.url(req, res)} | STATUS ${tokens.status(req, res)} | ` +
        `IP ${req.ip} | ${tokens.res(req, res, 'content-length')} - ${tokens['response-time'](req, res)}ms`;
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

        console.log(`Starting server...`)

        app.use(express.json());
        app.use(express.urlencoded({extended: false}));

        app.use('/', indexRouter);
        app.use('/auth', authRouter);
        app.use('/users', usersRouter);
        app.use('/transactions', transactionsRouter);

        app.listen(3000, () => {
            console.log(`Server started! Listening on :3000`)
        })
    })

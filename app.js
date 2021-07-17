const express = require('express');
const path = require('path');
require('dotenv').config();

console.log(`Starting server...`)

const app = express();

require('./plugins/typeorm').then(res => {
    const indexRouter = require('./routes/index');
    const authRouter = require('./routes/auth');
    const usersRouter = require('./routes/users');
    const transactionsRouter = require('./routes/transactions');

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/', indexRouter);
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/transactions', transactionsRouter);

    app.listen(3000, () => {
        console.log(`Server started! Listening on :3000`)
    })
})
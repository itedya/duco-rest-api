const express = require('express');
const path = require('path');
require('dotenv').config();

console.log(`Starting server...`)

const app = express();

require('./plugins/typeorm').then(res => {
    const indexRouter = require('./routes/index');
    const usersRouter = require('./routes/users');

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    app.listen(3000, () => {
        console.log(`Server started! Listening on :3000`)
    })
})
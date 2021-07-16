const express = require('express');
const router = express.Router();

const {getUsers, getCountOfUsers, getUserByUsername} = require('./../app/controllers/UsersController')

const pagination = require('../app/requests/pagination')
const getUserByUsernameValidator = require('../app/requests/Users/GetByUsername')

const addPaginationBody = require('./../app/middlewares/addPaginationBody')
const validate = require('./../app/middlewares/validate')

/* GET users listing. */
router.get('/',
    pagination,
    validate,
    async (req, res, next) => {
        let body = null;

        const count = await getCountOfUsers()

        try {
            body = addPaginationBody(count, req)
        } catch (e) {
            return res.status(400).json(e)
        }

        body.result = await getUsers(req.query.page - 1, req.query.per_page)

        res.json(body)
    });

router.get('/:username',
    getUserByUsernameValidator,
    validate,
    async (req, res, next) => {
        try {
            const user = await getUserByUsername(req.params.username)
            res.json({result: user})
        } catch (e) {
            res.status(400).json({
                errors: [{
                    msg: "User with this username doesn't exists!",
                    param: "username",
                    location: "param"
                }]
            })
        }
    });

module.exports = router;

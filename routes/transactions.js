const express = require('express');
const router = express.Router();

const paginationValidator = require('./../app/requests/pagination');

const validator = require('./../app/middlewares/Validate');

const TransactionsController = require('./../app/controllers/TransactionsController');

router.get(`/`, paginationValidator, validator, TransactionsController.getTransactions)

module.exports = router;

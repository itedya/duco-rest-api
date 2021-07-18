import {Router} from "express";
import GetTransactionByHash from "@/app/requests/Transactions/GetTransactionByHash";

const router = Router();

import pagination from "@/app/requests/pagination";
import Validate from "@/app/middlewares/Validate";
import TransactionsController from "@/app/controllers/TransactionsController";

router.get(`/`, pagination, Validate, TransactionsController.getTransactions);
router.get(`/:hash`, GetTransactionByHash, Validate, TransactionsController.getTransactionByHash);

module.exports = router;
import {Request, Response} from "express";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response) => {
  return res.json({ result: "OK" });
});

module.exports = router
import {Request, Response} from "express";

var express = require('express');
var router = express.Router();

router.get('/', (req: Request, res: Response) => {
  return res.json({ result: "OK" });
});

module.exports = router
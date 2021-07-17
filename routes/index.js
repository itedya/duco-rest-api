var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  return res.json({ result: "OK" })
});

module.exports = router;

const { param } = require("express-validator")

module.exports = [
    param("username").isLength({ min: 3, max: 64 })
]
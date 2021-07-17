const { param } = require("express-validator")

module.exports = [
    param("id").isLength({ min: 36, max: 36 }).isUUID(4)
]
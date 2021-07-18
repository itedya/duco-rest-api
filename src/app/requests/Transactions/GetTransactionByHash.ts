import { param } from "express-validator";

export default [
    param('hash').isString()
]
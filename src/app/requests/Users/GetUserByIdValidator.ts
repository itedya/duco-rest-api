import { param } from "express-validator";

export default [
    param("id").isLength({ min: 36, max: 36 }).isUUID(4)
]
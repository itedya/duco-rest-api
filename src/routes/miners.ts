import {Router} from "express";
import pagination from "@/app/requests/pagination";
import Validate from "@/app/middlewares/Validate";

import MinersController from "@/app/controllers/MinersController";

const router = Router();

router.get(`/`, pagination, Validate, MinersController.getMiners);

module.exports = router;
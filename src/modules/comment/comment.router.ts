import { Router } from "express";
import { commentControler } from "./comment.controler";

import auth, { UserRole } from "../../middllewares/auth";

const router = Router()

router.post('/', auth(UserRole.USER , UserRole.ADMIN), commentControler.createComment)


export const commentRouter:Router = router
import { Router } from "express";
import { commentControler } from "./comment.controler";

import auth, { UserRole } from "../../middllewares/auth";

const router = Router()

router.get('/author/:authorId', commentControler.getCommentByAuthorId)

router.post('/', auth(UserRole.USER , UserRole.ADMIN), commentControler.createComment)

router.delete('/:id', auth(UserRole.USER, UserRole.ADMIN), commentControler.deleteComment)

router.patch('/:commentId', auth(UserRole.USER, UserRole.ADMIN), commentControler.updateComment)

export const commentRouter:Router = router
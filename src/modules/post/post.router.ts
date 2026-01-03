
import express from "express"
import { postControler } from "./post.controler";
import auth, { UserRole } from "../../middllewares/auth";


const router = express.Router();


router.get('/', postControler.getPost),
router.get('/:id', postControler.getPostById),
router.post('/', auth(UserRole.USER),  postControler.createPost)


export const postRouter = router;
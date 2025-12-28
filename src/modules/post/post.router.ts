
import express from "express"
import { postControler } from "./post.controler";

const router = express.Router();

router.post('/', postControler.createPost)


export const postRouter = router;
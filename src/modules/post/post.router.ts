
import express from "express"
import { postControler } from "./post.controler";
import auth, { UserRole } from "../../middllewares/auth";


const router = express.Router();


router.get('/', postControler.getPost)
router.get('/my-posts', auth(UserRole.USER, UserRole.ADMIN), postControler.getMyPosts)


router.get('/:id', postControler.getPostById)
router.post('/', auth(UserRole.USER, UserRole.ADMIN),  postControler.createPost)
router.patch('/:id', auth(UserRole.USER, UserRole.ADMIN), postControler.updateOwnPost)
router.delete('/:postId', auth(UserRole.USER, UserRole.ADMIN), postControler.deletePost)
export const postRouter = router;




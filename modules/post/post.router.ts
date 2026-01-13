import express from "express"
import { postController } from "./post.controller"
import auth, { UserRole } from "../../src/lib/middlewares/auth"

const router = express.Router()



router.post('/', auth(UserRole.USER), postController.createPost)
router.get('/', postController.getAllPosts)
router.get('/my-posts', auth(UserRole.USER, UserRole.ADMIN), postController.getSingleUserPost)
router.get('/:id', postController.getPostById)
router.patch('/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.updatePost)
router.delete('/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.deletePost)



export const postRouter = router
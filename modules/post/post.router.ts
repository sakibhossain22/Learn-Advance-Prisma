import express, { NextFunction, Request, Response } from "express"
import { postController } from "./post.controller"
import auth, { UserRole } from "../../src/lib/middlewares/auth"

const router = express.Router()



router.post('/', auth(UserRole.USER), postController.createPost)
router.get('/', postController.getAllPosts)
router.get('/:id', postController.getPostById)



export const postRouter = router
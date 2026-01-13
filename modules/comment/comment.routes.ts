import express from "express"
import { commentController } from "./comment.controller"
import auth, { UserRole } from "../../src/lib/middlewares/auth"
const router = express.Router()

router.post('/', auth(UserRole.ADMIN, UserRole.USER), commentController.createComment)
router.get('/:commentId', commentController.getCommnetById)
router.get('/author/:authorId', commentController.getCommnetByAuthorId)
router.delete('/:commentId', auth(UserRole.USER, UserRole.ADMIN), commentController.deleteCommnetById)
router.patch('/:commentId',auth(UserRole.USER,UserRole.ADMIN), commentController.updateCommnent)
router.patch('/modarate/:commentId',auth(UserRole.ADMIN), commentController.modarateComment)



export const commentRouter = router
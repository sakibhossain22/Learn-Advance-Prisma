import { Request, Response } from "express";
import { commentService } from "./comment.services";
const getCommnetById = async (req: Request, res: Response) => {

    try {
        const result = await commentService.getCommnetById(req.params.commentId as string);
        res.status(201)
            .json(
                {
                    message: "Comment fetched successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to fetch comment",
                    details: error
                }
            );
    }
}
const getCommnetByAuthorId = async (req: Request, res: Response) => {

    try {
        const result = await commentService.getCommnetByAuthorId(req.params.authorId as string);
        res.status(201)
            .json(
                {
                    message: "Comment fetched successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to fetch comment",
                    details: error
                }
            );
    }
}
const createComment = async (req: Request, res: Response) => {
    req.body.authorid = req.user?.id

    try {
        const result = await commentService.createComment(req.body);
        res.status(201)
            .json(
                {
                    message: "Comment created successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to create comment",
                    details: error
                }
            );
    }
}
const deleteCommnetById = async (req: Request, res: Response) => {

    try {
        const result = await commentService.deleteCommnetById(req.params.commentId as string, req.user?.id as string);
        res.status(201)
            .json(
                {
                    message: "Comment Deleted successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to Delete comment",
                    details: error
                }
            );
    }
}
const updateCommnent = async (req: Request, res: Response) => {

    try {
        const result = await commentService.updateCommnent(req.params.commentId as string,req.body, req.user?.id as string);
        res.status(201)
            .json(
                {
                    message: "Comment Updated successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to Update the comment",
                    details: error
                }
            );
    }
}

export const commentController = {
    createComment,
    getCommnetById,
    getCommnetByAuthorId,
    deleteCommnetById,
    updateCommnent
}
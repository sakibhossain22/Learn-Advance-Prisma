import { Request, Response } from "express";
import { postService } from "./post.services";
import { PostStatus } from "../../generated/prisma/enums";
import paginationHelpers from "../../src/helpers/paginationHelpers";
const getAllPosts = async (req: Request, res: Response) => {
    const { search } = req?.query;
    //      Handle tags query parameter
    const tags: string[] | undefined = typeof req.query.tags === "string" ? req.query.tags.split(",") : undefined
    // Filter using isFeatured
    const isFeatured = req.query.isfeatured === 'true' ? true : req.query.isfeatured === 'false' ? false : undefined;
    // filter using status
    const status = req.query.status as PostStatus | undefined;

    // pagingation Helper
    const { page, limit, skip, sortby, sortorder } = paginationHelpers(req.query as any);
    try {
        // Logic to get all posts
        const { posts } = await postService.getAllPosts(search as string, tags, isFeatured, status?.toUpperCase() as PostStatus, page, limit, skip, sortby as string, sortorder as string);
        res.status(201).json({
            success: "post fetched...",
            posts
        })
    }
    catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to fetch post",
                    details: error
                }
            );
    }
}
const getPostById = async (req: Request, res: Response) => {
    try {
        const result = await postService.getPostById(req.params.id as string)
        console.log(result);

        res.status(200).json({
            "success": true,
            "post": result
        })
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to fetch the post",
                    details: error
                }
            );
    }
}
const createPost = async (req: any, res: any) => {
    try {
        // Logic to create a post
        const result = await postService.createPost(req.body, req.user.id);
        res.status(201)
            .json(
                {
                    message: "Post created successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to create post",
                    details: error
                }
            );
    }
}
export const postController = {
    createPost,
    getAllPosts,
    getPostById
}
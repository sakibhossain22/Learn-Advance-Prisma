import { Request, Response } from "express";
import { postService } from "./post.services";
import { PostStatus } from "../../generated/prisma/enums";
import paginationHelpers from "../../src/helpers/paginationHelpers";
import { UserRole } from "../../src/lib/middlewares/auth";
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
                    error: "Failed to fetch The post",
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
const updatePost = async (req: any, res: any) => {
    const isAdmin = req.user.role === UserRole.ADMIN
    try {
        // Logic to create a post
        const result = await postService.updatePost(req.params.postId, req.body, req.user.id, isAdmin);
        res.status(201)
            .json(
                {
                    message: "Post Updated successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to Update post",
                    details: error
                }
            );
    }
}
const deletePost = async (req: any, res: any) => {
    const isAdmin = req.user.role === UserRole.ADMIN
    try {
        // Logic to create a post
        const result = await postService.deletePost(req.params.postId, req.user.id, isAdmin);
        res.status(201)
            .json(
                {
                    message: "Post Deleted successfully",
                    data: result
                }
            );
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Delete post"
        res.status(500)
            .json(
                {
                    error: errorMessage,
                    details: error
                }
            );
    }
}
const getSingleUserPost = async (req: any, res: any) => {
    if (!req.user) {
        throw new Error("You're Unauthorized")
    }
    try {
        // Logic to create a post
        const result = await postService.getSingleUserPost(req.user.id);
        res.status(201)
            .json(
                {
                    message: "Post Fetched successfully",
                    data: result
                }
            );
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: "Failed to Fetch post",
                    details: error
                }
            );
    }
}
export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getSingleUserPost,
    updatePost,
    deletePost
}
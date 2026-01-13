import { CommentStatus, Post, PostStatus } from "../../generated/prisma/client";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../src/lib/prisma";

const getAllPosts = async (search: string, tags: string[] | undefined, isFeatured: boolean | undefined, status: PostStatus | undefined, page: number, limit: number, skip: number, sortby: string, sortorder: string) => {

    const andCondition: PostWhereInput[] = []
    if (search) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search,

                    }
                }
            ]
        })
    }
    if (tags && tags.length > 0) {
        andCondition.push({
            tags: { hasEvery: tags }
        })
    }
    if (typeof isFeatured === 'boolean') {
        andCondition.push({
            isFeatured: isFeatured
        })
    }
    if (status) {
        andCondition.push({
            status: status
        })
    }
    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition
        },
        include: {
            _count: {
                select: {
                    Comments: true
                }
            }
        },
        orderBy: {
            [sortby]: sortorder
        }
    })
    const total = await prisma.post.count({
        where: {
            AND: andCondition
        }
    })
    return { posts: result, total, page, limit, totalPages: Math.ceil(total / limit) };
}
const getPostById = async (id: string) => {
    return await prisma.$transaction(async (ur) => {
        await ur.post.update({
            where: {
                id: id
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const result = await ur.post.findUnique({
            where: {
                id
            },
            include: {
                Comments: {
                    where: {
                        parentid: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: { createdAt: "desc" },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: { createdAt: "desc" },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        Comments: true
                    }
                }
            }

        })
        return result
    })
}
const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorid'>, userId: string) => {
    // Logic to create a post
    const result = await prisma.post.create({
        data: {
            ...data,
            authorid: userId
        }
    });
    return result;
}

export const postService = {
    createPost,
    getAllPosts,
    getPostById
}
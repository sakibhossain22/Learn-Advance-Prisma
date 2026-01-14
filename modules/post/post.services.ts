import { CommentStatus, Post, PostStatus } from "../../generated/prisma/client";
import { PostWhereInput } from "../../generated/prisma/models";
import { UserRole } from "../../src/lib/middlewares/auth";
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
const updatePost = async (postId: string, data: Partial<Post>, userId: string, isAdmin: boolean) => {
    const postResponse = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
            authorid: userId
        },
        select: {
            id: true,
            authorid: true
        }
    })
    if (!isAdmin && postResponse.authorid !== userId) {
        throw new Error("Your are not the author of this post")
    }
    if (!isAdmin) {
        delete data.isFeatured
    }
    const result = await prisma.post.update({
        where: {
            id: postId,
            authorid: userId
        },
        data: data
    })
    return result
}
const deletePost = async (postId: string, userId: string, isAdmin: boolean) => {
    const postResponse = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorid: true
        }
    })
    if (!isAdmin && postResponse.authorid !== userId) {
        throw new Error("Your can't delete this post Cause you're not the Owner of this post")
    }
    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })
    return result
}
const postStats = async () => {
    return await prisma.$transaction(async (rs) => {
        const [totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComments, totalUsers, adminCount, userCount, totalViews] = await Promise.all([
            await rs.post.count(),
            await rs.post.count({ where: { status: "PUBLISHED" } }),
            await rs.post.count({ where: { status: "DRAFT" } }),
            await rs.post.count({ where: { status: "ARCHIVE" } }),
            await rs.comment.count(),
            await rs.comment.count({ where: { status: "APPROVED" } }),
            await rs.user.count(),
            await rs.user.count({ where: { role: UserRole.ADMIN } }),
            await rs.user.count({ where: { role: UserRole.USER } }),
            await rs.post.aggregate({ _sum: { views: true } })
        ])
        return {
            totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComments, totalUsers, adminCount, userCount, totalViews: totalViews._sum.views
        }
    })


}
const getSingleUserPost = async (userid: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: userid,
            status: "ACTIVE"
        }
    })
    const data = await prisma.post.findMany({
        where: {
            authorid: userid
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    console.log(data);
    return data
}

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    getSingleUserPost,
    updatePost,
    deletePost,
    postStats
}
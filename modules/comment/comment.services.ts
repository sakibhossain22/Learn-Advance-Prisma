import { prisma } from "../../src/lib/prisma";

interface CommentInput {
    content: string;
    postid: string;
    authorid: string;
    parentid?: string;
}

const createComment = async (commentData: CommentInput) => {
    const { content, postid, authorid, parentid } = commentData
    console.log("console form service", { content, postid, authorid });
    const result = await prisma.comment.create({
        data: {
            content,
            postid: postid,
            authorid: authorid,
            parentid: parentid ?? null
        }
    })
    return result
}
const getCommnetById = async (commnetId: string) => {

    const result = await prisma.comment.findUnique({
        where: {
            id: commnetId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                    views: true
                }
            }
        }
    })
    return result
}
const deleteCommnetById = async (commentId: string, authorid: string) => {
    console.log(commentId);
    const result = await prisma.comment.delete({
        where: {
            id: commentId,
            authorid
        }
    })
    return result
}
const getCommnetByAuthorId = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorid: authorId
        }
    })
    return result
}
const updateCommnent = async (commentId: string, data: any, authorid: string) => {
    const { content, status } = data
    console.log({ commentId, status, content, authorid });
    return await prisma.comment.update({
        where: {
            authorid: authorid,
            id: commentId
        },
        data: {
            content: content,
            status: status
        }
    })

}
const modarateComment = async (commentId: string, data: any) => {
    const { status } = data

    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    })
    return await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            status: status
        }
    })

}
export const commentService = {
    createComment,
    getCommnetById,
    getCommnetByAuthorId,
    deleteCommnetById,
    updateCommnent,
    modarateComment
}
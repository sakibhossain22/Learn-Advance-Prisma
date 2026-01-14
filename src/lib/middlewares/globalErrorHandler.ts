import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client";

const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    var statusCode = 500
    var errorMessage = "Internal server error"
    var errorDetails = err
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400,
            errorMessage = "You Provided incorrect field type or missing fields"
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 400,
                errorMessage = "an operation failed because it depent on one or more records that were required"
        }
        if (err.code === "P2002") {
            statusCode = 400,
                errorMessage = "Duplicate  key error"
        }
        if (err.code === "P2003") {
            statusCode = 400,
                errorMessage = "Foreing key constraint failed"
        }
    }
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 400,
        errorMessage = "Error Occured During Query Execution"
    }

        if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 400,
                errorMessage = "authentication failed !! Please Check Your Creadentials"
        }
        if (err.errorCode === "P1001") {
            statusCode = 400,
                errorMessage = "Can't Reach database server"
        }
    }
    res.status(500).json({
        message: errorMessage,
        error: err
    })
}

export default globalErrorHandler
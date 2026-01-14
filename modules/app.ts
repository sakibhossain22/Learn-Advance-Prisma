import express from 'express';
import { postRouter } from './post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from '../src/lib/auth';
import cors from 'cors';
import { commentRouter } from './comment/comment.routes';
import globalErrorHandler from '../src/lib/middlewares/globalErrorHandler';
import { notFound } from '../src/lib/middlewares/notFound';


const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:4000",
    credentials: true
}));

app.all("/api/auth/*slat", toNodeHandler(auth));
app.use('/posts', postRouter)
app.use('/comment', commentRouter)
app.use(notFound)
app.use(globalErrorHandler)
export default app;

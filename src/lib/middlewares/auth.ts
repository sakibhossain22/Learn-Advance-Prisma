import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from "../../lib/auth"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name?: string;
                role?: string;
                emailVerified: boolean;
            };
        }
    }
}
export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}
const auth = (...role : UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!session.user.emailVerified) {
            return res.status(403).json({ error: "Email not verified" });
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            emailVerified: session.user.emailVerified
        }

        if (role.length > 0 && (!req.user.role || !role.includes(req.user.role as UserRole))) {
            return res.status(403).json({ error: "Forbidden" });
        }   
        next()
    }
}

export default auth;
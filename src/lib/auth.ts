import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// Configure the email transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASSWORD as string,
    },
});

const emailVerificationTemplate = (name: string, verifyUrl: string) => `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;background:#f4f4f5;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;">
    <h2 style="color:#111827;">Verify Your Email</h2>
    <p>Hello ${name},</p>
    <p>Please verify your email by clicking the button below:</p>
    <a href="${verifyUrl}"
       style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
      Verify Email
    </a>
    <p style="margin-top:20px;font-size:13px;color:#6b7280;">
      If you didn’t create this account, you can ignore this email.
    </p>
    <p style="font-size:13px;color:#6b7280;">— Blog App Team</p>
  </div>
</body>
</html>
`;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                isRequired: false,
            },
            phone: {
                type: "string",
                isRequired: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                isRequired: false,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            // Send verification email.
            const verificationUrl = `http://localhost:4000/api/auth/verify-email?token=${token}`;
            try {
                const info = await transporter.sendMail({
                    from: `"Blog App" <${process.env.EMAIL_USER}>`,
                    to: user.email, // 🔥 dynamic user email
                    subject: "Verify your email",
                    html: emailVerificationTemplate(
                        user.name || "User",
                        verificationUrl // better-auth verification URL
                    ),
                });

                console.log("Email sent:", info.messageId);
            } catch (err) {
                console.error("Error while sending mail", err);
            }


        }
    },
    socialProviders: {
        google: {
            prompt : "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});

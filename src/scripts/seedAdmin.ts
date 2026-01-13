import { UserRole } from "../lib/middlewares/auth";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {
        const adminData = {
            name: "Shakib Admin",
            email: "admin@admin.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        }
        // Seed admin user logic here
        const admingExists = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (admingExists) {
            throw new Error('This Email Already Registered ... !!')
        }
        // create Admin
        const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        if(signUpAdmin.ok) {
            await prisma.user.update({
                where : {
                    email : adminData.email
                },
                data : {
                    emailVerified : true
                }
            })
        }
    }catch (error) {
        console.error(error);
    }

}
seedAdmin()
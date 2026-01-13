import "dotenv/config"; 
import { prisma } from "../src/lib/prisma";
import app from "./app";



const port = process.env.PORT || 3000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully...");

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error connecting to database:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
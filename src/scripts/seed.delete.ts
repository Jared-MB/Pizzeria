import { db } from "../db";
import { employees, type NewEmployee } from "../db/schemas";
import * as bcrypt from "bcryptjs"

export const cleanupDB = async () => {
    try {
        await db.delete(employees)
        console.log("DB cleaned")
    }
    catch (error) {
        console.error("Error cleaning DB", error)
    }
}

cleanupDB().then(() => {
    console.log("Seed completed")
    process.exit(0)
}).catch((error) => {
    console.error("Seed failed", error)
    process.exit(1)
})
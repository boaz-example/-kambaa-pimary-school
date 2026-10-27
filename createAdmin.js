const bcrypt = require("bcrypt");
const db = require("./config/db");
require("dotenv").config();

async function createAdmin() {
    try {
        const password = "Admin@1234";

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (name, email, password, role, phone)
             VALUES (?, ?, ?, ?, ?)`,
            [
                "System Administrator",
                "admin@ackkambaa.ac.ke",
                hashedPassword,
                "admin",
                "0700000000"
            ]
        );

        console.log("✅ Admin account created successfully.");
        console.log("Email: admin@ackkambaa.ac.ke");
        console.log("Password: Admin@1234");

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        process.exit();
    }
}

createAdmin();
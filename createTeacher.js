const bcrypt = require("bcrypt");
const db = require("./config/db");

async function createTeacher() {
    try {

        const name = "John Teacher";
        const email = "teacher@ackkambaa.ac.ke";
        const password = "Teacher@1234";
        const role = "teacher";

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role]
        );

        console.log("Teacher created successfully!");
        console.log("ID:", result.insertId);
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {

        console.error("Error:", error.message);

    } finally {

        process.exit();

    }
}

createTeacher();
const bcrypt = require("bcrypt");
const db = require("./config/db");

async function resetAdmin() {
    try {
        const email = "admin@ackkambaa.ac.ke";
        const newPassword = "Admin@12345";

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email]
        );

        if (result.affectedRows === 0) {
            console.log("❌ Admin account not found.");
        } else {
            console.log("✅ Admin password reset successfully.");
            console.log("Email:", email);
            console.log("New password:", newPassword);
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        process.exit();
    }
}

resetAdmin();
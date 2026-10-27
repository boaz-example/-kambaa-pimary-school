const db = require("../config/db");

class UserModel {

    // ==========================================
    // FIND USER BY EMAIL
    // ==========================================

    static async findByEmail(email) {

        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return rows[0];
    }


    // ==========================================
    // FIND USER BY ID
    // ==========================================

    static async findById(id) {

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                role,
                phone,
                status,
                password_set
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }


    // ==========================================
    // CREATE USER
    // ==========================================

    static async create(user) {

        const {
            name,
            email,
            password,
            role,
            phone,
            password_set
        } = user;

        const [result] = await db.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                role,
                phone,
                password_set
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                password || null,
                role,
                phone || null,
                password_set ?? 1
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // SET PASSWORD
    // ==========================================

    static async setPassword(id, hashedPassword) {

        const [result] = await db.query(
            `
            UPDATE users
            SET
                password = ?,
                password_set = 1
            WHERE id = ?
            `,
            [
                hashedPassword,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // FIND FIRST-TIME USER
    // ==========================================

    static async findFirstTimeUser(email) {

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                role,
                phone,
                status,
                password_set
            FROM users
            WHERE email = ?
            AND password_set = 0
            `,
            [email]
        );

        return rows[0];
    }

}

module.exports = UserModel;
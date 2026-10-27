const db = require("../config/db");

class ParentModel {

    // ==========================================
    // GET ALL PARENTS
    // ==========================================

    static async getAll() {

        const [rows] = await db.query(`
            SELECT
                p.id,
                p.user_id,
                u.name,
                u.email,
                u.phone,
                u.status,
                p.occupation,
                p.address,
                p.relationship,
                p.created_at,
                p.updated_at

            FROM parents p

            INNER JOIN users u
                ON p.user_id = u.id

            ORDER BY u.name ASC
        `);

        return rows;
    }


    // ==========================================
    // GET PARENT BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                p.id,
                p.user_id,
                u.name,
                u.email,
                u.phone,
                u.status,
                p.occupation,
                p.address,
                p.relationship,
                p.created_at,
                p.updated_at

            FROM parents p

            INNER JOIN users u
                ON p.user_id = u.id

            WHERE p.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // GET PARENT BY USER ID
    // ==========================================

    static async getByUserId(userId) {

        const [rows] = await db.query(`
            SELECT
                p.id,
                p.user_id,
                u.name,
                u.email,
                u.phone,
                u.status,
                p.occupation,
                p.address,
                p.relationship,
                p.created_at,
                p.updated_at

            FROM parents p

            INNER JOIN users u
                ON p.user_id = u.id

            WHERE p.user_id = ?
        `, [userId]);

        return rows[0];
    }


    // ==========================================
    // CREATE PARENT PROFILE
    // ==========================================

    static async create(parent) {

        const {
            user_id,
            occupation,
            address,
            relationship
        } = parent;

        const [result] = await db.query(
            `
            INSERT INTO parents
            (
                user_id,
                occupation,
                address,
                relationship
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                user_id,
                occupation || null,
                address || null,
                relationship || null
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE PARENT PROFILE
    // ==========================================

    static async update(id, parent) {

        const {
            occupation,
            address,
            relationship
        } = parent;

        const [result] = await db.query(
            `
            UPDATE parents
            SET
                occupation = ?,
                address = ?,
                relationship = ?

            WHERE id = ?
            `,
            [
                occupation || null,
                address || null,
                relationship || null,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE PARENT PROFILE
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM parents
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = ParentModel;
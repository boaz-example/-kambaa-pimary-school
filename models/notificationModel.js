const db = require("../config/db");

class NotificationModel {

    // ==========================================
    // GET ALL NOTIFICATIONS FOR A USER
    // ==========================================

    static async getByUserId(userId) {

        const [rows] = await db.query(`
            SELECT
                id,
                user_id,
                title,
                message,
                type,
                is_read,
                related_type,
                related_id,
                created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userId]);

        return rows;
    }


    // ==========================================
    // GET UNREAD NOTIFICATIONS
    // ==========================================

    static async getUnread(userId) {

        const [rows] = await db.query(`
            SELECT
                id,
                user_id,
                title,
                message,
                type,
                is_read,
                related_type,
                related_id,
                created_at
            FROM notifications
            WHERE user_id = ?
              AND is_read = FALSE
            ORDER BY created_at DESC
        `, [userId]);

        return rows;
    }


    // ==========================================
    // GET NOTIFICATION BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                id,
                user_id,
                title,
                message,
                type,
                is_read,
                related_type,
                related_id,
                created_at
            FROM notifications
            WHERE id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    static async create(data) {

        const {
            user_id,
            title,
            message,
            type,
            related_type,
            related_id
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                type,
                related_type,
                related_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                user_id,
                title,
                message,
                type || "Info",
                related_type || null,
                related_id || null
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    static async markAsRead(id, userId) {

        const [result] = await db.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = ?
              AND user_id = ?
            `,
            [id, userId]
        );

        return result.affectedRows;
    }


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    static async markAllAsRead(userId) {

        const [result] = await db.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE user_id = ?
              AND is_read = FALSE
            `,
            [userId]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE NOTIFICATION
    // ==========================================

    static async delete(id, userId) {

        const [result] = await db.query(
            `
            DELETE FROM notifications
            WHERE id = ?
              AND user_id = ?
            `,
            [id, userId]
        );

        return result.affectedRows;
    }
}

module.exports = NotificationModel;
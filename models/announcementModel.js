const db = require("../config/db");

class AnnouncementModel {

    // ==========================================
    // GET ALL ANNOUNCEMENTS
    // ==========================================

    static async getAll() {

        const [rows] = await db.query(`
            SELECT
                a.id,
                a.title,
                a.content,
                a.target_audience,
                a.created_by,
                u.name AS creator_name,
                a.published_at,
                a.status,
                a.created_at,
                a.updated_at
            FROM announcements a
            INNER JOIN users u
                ON a.created_by = u.id
            ORDER BY a.created_at DESC
        `);

        return rows;
    }


    // ==========================================
    // GET PUBLISHED ANNOUNCEMENTS
    // ==========================================

    static async getPublished() {

        const [rows] = await db.query(`
            SELECT
                a.id,
                a.title,
                a.content,
                a.target_audience,
                a.created_by,
                u.name AS creator_name,
                a.published_at,
                a.status,
                a.created_at,
                a.updated_at
            FROM announcements a
            INNER JOIN users u
                ON a.created_by = u.id
            WHERE a.status = 'Published'
            ORDER BY a.published_at DESC
        `);

        return rows;
    }


    // ==========================================
    // GET ANNOUNCEMENT BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                a.id,
                a.title,
                a.content,
                a.target_audience,
                a.created_by,
                u.name AS creator_name,
                a.published_at,
                a.status,
                a.created_at,
                a.updated_at
            FROM announcements a
            INNER JOIN users u
                ON a.created_by = u.id
            WHERE a.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // CREATE ANNOUNCEMENT
    // ==========================================

    static async create(data) {

        const {
            title,
            content,
            target_audience,
            created_by,
            published_at,
            status
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO announcements
            (
                title,
                content,
                target_audience,
                created_by,
                published_at,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                title,
                content,
                target_audience || "All",
                created_by,
                published_at || null,
                status || "Draft"
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE ANNOUNCEMENT
    // ==========================================

    static async update(id, data) {

        const {
            title,
            content,
            target_audience,
            published_at,
            status
        } = data;

        const [result] = await db.query(
            `
            UPDATE announcements
            SET
                title = ?,
                content = ?,
                target_audience = ?,
                published_at = ?,
                status = ?
            WHERE id = ?
            `,
            [
                title,
                content,
                target_audience,
                published_at || null,
                status,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // PUBLISH ANNOUNCEMENT
    // ==========================================

    static async publish(id) {

        const [result] = await db.query(
            `
            UPDATE announcements
            SET
                status = 'Published',
                published_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }


    // ==========================================
    // ARCHIVE ANNOUNCEMENT
    // ==========================================

    static async archive(id) {

        const [result] = await db.query(
            `
            UPDATE announcements
            SET
                status = 'Archived'
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE ANNOUNCEMENT
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM announcements
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = AnnouncementModel;
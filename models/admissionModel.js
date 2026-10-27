const db = require("../config/db");

class AdmissionModel {

    // ==========================================
    // GET ALL ADMISSIONS
    // ==========================================

    static async getAll(status = null) {

        let sql = `
            SELECT
                a.id,
                a.first_name,
                a.last_name,
                a.date_of_birth,
                a.gender,
                a.requested_class_id,
                c.class_name,
                a.parent_name,
                a.parent_phone,
                a.parent_email,
                a.status,
                a.reviewed_by,
                a.reviewed_at,
                a.created_at
            FROM admissions a
            LEFT JOIN classes c
                ON a.requested_class_id = c.id
        `;

        const params = [];

        if (status) {
            sql += ` WHERE a.status = ?`;
            params.push(status);
        }

        sql += ` ORDER BY a.created_at DESC`;

        const [rows] = await db.query(sql, params);

        return rows;
    }


    // ==========================================
    // GET ONE ADMISSION
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(
            `
            SELECT
                a.*,
                c.class_name
            FROM admissions a
            LEFT JOIN classes c
                ON a.requested_class_id = c.id
            WHERE a.id = ?
            `,
            [id]
        );

        return rows[0];
    }


    // ==========================================
    // CREATE ADMISSION
    // ==========================================

    static async create(data) {

        const [result] = await db.query(
            `
            INSERT INTO admissions (
                first_name,
                last_name,
                date_of_birth,
                gender,
                requested_class_id,
                parent_name,
                parent_phone,
                parent_email,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            `,
            [
                data.first_name,
                data.last_name,
                data.date_of_birth || null,
                data.gender || null,
                data.requested_class_id || null,
                data.parent_name,
                data.parent_phone,
                data.parent_email || null
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE APPLICATION STATUS
    // ==========================================

    static async updateStatus(id, status, reviewedBy) {

        const [result] = await db.query(
            `
            UPDATE admissions
            SET
                status = ?,
                reviewed_by = ?,
                reviewed_at = NOW()
            WHERE id = ?
            `,
            [
                status,
                reviewedBy,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM admissions
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = AdmissionModel;
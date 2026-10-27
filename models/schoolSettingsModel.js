const db = require("../config/db");

class SchoolSettingsModel {

    // ==========================================
    // GET SCHOOL SETTINGS
    // ==========================================

    static async get() {

        const [rows] = await db.query(`
            SELECT
                id,
                school_name,
                school_code,
                address,
                phone,
                email,
                website,
                motto,
                logo,
                current_academic_year,
                current_term,
                created_at,
                updated_at
            FROM school_settings
            ORDER BY id ASC
            LIMIT 1
        `);

        return rows[0];
    }


    // ==========================================
    // GET SETTINGS BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                id,
                school_name,
                school_code,
                address,
                phone,
                email,
                website,
                motto,
                logo,
                current_academic_year,
                current_term,
                created_at,
                updated_at
            FROM school_settings
            WHERE id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // CREATE SCHOOL SETTINGS
    // ==========================================

    static async create(data) {

        const {
            school_name,
            school_code,
            address,
            phone,
            email,
            website,
            motto,
            logo,
            current_academic_year,
            current_term
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO school_settings
            (
                school_name,
                school_code,
                address,
                phone,
                email,
                website,
                motto,
                logo,
                current_academic_year,
                current_term
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                school_name,
                school_code || null,
                address || null,
                phone || null,
                email || null,
                website || null,
                motto || null,
                logo || null,
                current_academic_year || null,
                current_term || null
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE SCHOOL SETTINGS
    // ==========================================

    static async update(id, data) {

        const {
            school_name,
            school_code,
            address,
            phone,
            email,
            website,
            motto,
            logo,
            current_academic_year,
            current_term
        } = data;

        const [result] = await db.query(
            `
            UPDATE school_settings
            SET
                school_name = ?,
                school_code = ?,
                address = ?,
                phone = ?,
                email = ?,
                website = ?,
                motto = ?,
                logo = ?,
                current_academic_year = ?,
                current_term = ?
            WHERE id = ?
            `,
            [
                school_name,
                school_code || null,
                address || null,
                phone || null,
                email || null,
                website || null,
                motto || null,
                logo || null,
                current_academic_year || null,
                current_term || null,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE SCHOOL SETTINGS
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM school_settings
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = SchoolSettingsModel;
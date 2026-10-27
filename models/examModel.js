const db = require("../config/db");

class ExamModel {

    // ==========================================
    // GET ALL EXAMS
    // ==========================================

    static async getAll() {

        const [rows] = await db.query(`
            SELECT
                e.id,
                e.exam_name,
                e.academic_year,
                e.term,
                e.start_date,
                e.end_date,
                e.created_by,
                u.name AS created_by_name,
                e.created_at,
                e.updated_at

            FROM exams e

            LEFT JOIN users u
                ON e.created_by = u.id

            ORDER BY
                e.academic_year DESC,
                e.id DESC
        `);

        return rows;
    }


    // ==========================================
    // GET EXAM BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                e.id,
                e.exam_name,
                e.academic_year,
                e.term,
                e.start_date,
                e.end_date,
                e.created_by,
                u.name AS created_by_name,
                e.created_at,
                e.updated_at

            FROM exams e

            LEFT JOIN users u
                ON e.created_by = u.id

            WHERE e.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // CREATE EXAM
    // ==========================================

    static async create(exam) {

        const {
            exam_name,
            academic_year,
            term,
            start_date,
            end_date,
            created_by
        } = exam;

        const [result] = await db.query(
            `
            INSERT INTO exams
            (
                exam_name,
                academic_year,
                term,
                start_date,
                end_date,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                exam_name,
                academic_year,
                term,
                start_date || null,
                end_date || null,
                created_by
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE EXAM
    // ==========================================

    static async update(id, exam) {

        const {
            exam_name,
            academic_year,
            term,
            start_date,
            end_date
        } = exam;

        const [result] = await db.query(
            `
            UPDATE exams
            SET
                exam_name = ?,
                academic_year = ?,
                term = ?,
                start_date = ?,
                end_date = ?

            WHERE id = ?
            `,
            [
                exam_name,
                academic_year,
                term,
                start_date || null,
                end_date || null,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE EXAM
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM exams
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = ExamModel;
const db = require("../config/db");

class ResultModel {

    // ==========================================
    // GET ALL RESULTS
    // ==========================================

    static async getAll() {

        const [rows] = await db.query(`
            SELECT
                r.id,

                r.student_id,
                s.admission_number,
                CONCAT(
                    s.first_name,
                    ' ',
                    s.last_name
                ) AS student_name,

                r.subject_id,
                sub.subject_name,

                r.marks,
                r.term,
                r.academic_year,

                r.teacher_id,
                u.name AS teacher_name,

                r.created_at,
                r.updated_at

            FROM results r

            INNER JOIN students s
                ON r.student_id = s.id

            INNER JOIN subjects sub
                ON r.subject_id = sub.id

            INNER JOIN users u
                ON r.teacher_id = u.id

            ORDER BY
                r.academic_year DESC,
                r.term ASC,
                s.first_name ASC
        `);

        return rows;
    }


    // ==========================================
    // GET RESULT BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                r.id,

                r.student_id,
                s.admission_number,
                CONCAT(
                    s.first_name,
                    ' ',
                    s.last_name
                ) AS student_name,

                r.subject_id,
                sub.subject_name,

                r.marks,
                r.term,
                r.academic_year,

                r.teacher_id,
                u.name AS teacher_name,

                r.created_at,
                r.updated_at

            FROM results r

            INNER JOIN students s
                ON r.student_id = s.id

            INNER JOIN subjects sub
                ON r.subject_id = sub.id

            INNER JOIN users u
                ON r.teacher_id = u.id

            WHERE r.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // GET RESULTS FOR STUDENT
    // ==========================================

    static async getByStudent(studentId) {

        const [rows] = await db.query(`
            SELECT
                r.id,

                r.student_id,

                r.subject_id,
                sub.subject_name,

                r.marks,
                r.term,
                r.academic_year,

                r.teacher_id,
                u.name AS teacher_name,

                r.created_at,
                r.updated_at

            FROM results r

            INNER JOIN subjects sub
                ON r.subject_id = sub.id

            INNER JOIN users u
                ON r.teacher_id = u.id

            WHERE r.student_id = ?

            ORDER BY
                r.academic_year DESC,
                r.term ASC,
                sub.subject_name ASC
        `, [studentId]);

        return rows;
    }


    // ==========================================
    // GET RESULTS FOR SUBJECT
    // ==========================================

    static async getBySubject(subjectId) {

        const [rows] = await db.query(`
            SELECT
                r.id,

                r.student_id,
                s.admission_number,
                CONCAT(
                    s.first_name,
                    ' ',
                    s.last_name
                ) AS student_name,

                r.subject_id,

                r.marks,
                r.term,
                r.academic_year,

                r.teacher_id,
                u.name AS teacher_name,

                r.created_at,
                r.updated_at

            FROM results r

            INNER JOIN students s
                ON r.student_id = s.id

            INNER JOIN users u
                ON r.teacher_id = u.id

            WHERE r.subject_id = ?

            ORDER BY
                r.academic_year DESC,
                r.term ASC,
                s.first_name ASC
        `, [subjectId]);

        return rows;
    }


    // ==========================================
    // CREATE RESULT
    // ==========================================

    static async create(resultData) {

        const {
            student_id,
            subject_id,
            marks,
            term,
            academic_year,
            teacher_id
        } = resultData;

        const [result] = await db.query(
            `
            INSERT INTO results
            (
                student_id,
                subject_id,
                marks,
                term,
                academic_year,
                teacher_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                student_id,
                subject_id,
                marks,
                term,
                academic_year,
                teacher_id
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE RESULT
    // ==========================================

    static async update(id, resultData) {

        const {
            marks,
            term,
            academic_year
        } = resultData;

        const [result] = await db.query(
            `
            UPDATE results
            SET
                marks = ?,
                term = ?,
                academic_year = ?

            WHERE id = ?
            `,
            [
                marks,
                term,
                academic_year,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE RESULT
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM results
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = ResultModel;
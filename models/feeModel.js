const db = require("../config/db");

class FeeModel {

    // ==========================================
    // GET ALL FEES
    // ==========================================

    static async getAll() {
        const [rows] = await db.query(`
            SELECT
                f.id,
                f.student_id,
                s.admission_number,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,

                f.academic_year,
                f.term,
                f.amount_due,

                COALESCE(
                    SUM(p.amount_paid),
                    0
                ) AS amount_paid,

                (
                    f.amount_due -
                    COALESCE(SUM(p.amount_paid), 0)
                ) AS balance,

                f.created_at,
                f.updated_at

            FROM fees f

            INNER JOIN students s
                ON f.student_id = s.id

            LEFT JOIN payments p
                ON f.id = p.fee_id

            GROUP BY
                f.id,
                f.student_id,
                s.admission_number,
                s.first_name,
                s.last_name,
                f.academic_year,
                f.term,
                f.amount_due,
                f.created_at,
                f.updated_at

            ORDER BY f.id DESC
        `);

        return rows;
    }


    // ==========================================
    // GET FEE BY ID
    // ==========================================

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT
                f.id,
                f.student_id,
                s.admission_number,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,

                f.academic_year,
                f.term,
                f.amount_due,

                COALESCE(
                    SUM(p.amount_paid),
                    0
                ) AS amount_paid,

                (
                    f.amount_due -
                    COALESCE(SUM(p.amount_paid), 0)
                ) AS balance,

                f.created_at,
                f.updated_at

            FROM fees f

            INNER JOIN students s
                ON f.student_id = s.id

            LEFT JOIN payments p
                ON f.id = p.fee_id

            WHERE f.id = ?

            GROUP BY
                f.id,
                f.student_id,
                s.admission_number,
                s.first_name,
                s.last_name,
                f.academic_year,
                f.term,
                f.amount_due,
                f.created_at,
                f.updated_at
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // GET FEES FOR STUDENT
    // ==========================================

    static async getByStudent(studentId) {
        const [rows] = await db.query(`
            SELECT
                f.id,
                f.student_id,
                s.admission_number,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,

                f.academic_year,
                f.term,
                f.amount_due,

                COALESCE(
                    SUM(p.amount_paid),
                    0
                ) AS amount_paid,

                (
                    f.amount_due -
                    COALESCE(SUM(p.amount_paid), 0)
                ) AS balance

            FROM fees f

            INNER JOIN students s
                ON f.student_id = s.id

            LEFT JOIN payments p
                ON f.id = p.fee_id

            WHERE f.student_id = ?

            GROUP BY
                f.id,
                f.student_id,
                s.admission_number,
                s.first_name,
                s.last_name,
                f.academic_year,
                f.term,
                f.amount_due

            ORDER BY
                f.academic_year DESC,
                f.term ASC
        `, [studentId]);

        return rows;
    }


    // ==========================================
    // CREATE FEE
    // ==========================================

    static async create(fee) {

        const {
            student_id,
            academic_year,
            term,
            amount_due
        } = fee;

        const [result] = await db.query(
            `
            INSERT INTO fees
            (
                student_id,
                academic_year,
                term,
                amount_due
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                student_id,
                academic_year,
                term,
                amount_due
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE FEE
    // ==========================================

    static async update(id, fee) {

        const {
            academic_year,
            term,
            amount_due
        } = fee;

        const [result] = await db.query(
            `
            UPDATE fees
            SET
                academic_year = ?,
                term = ?,
                amount_due = ?
            WHERE id = ?
            `,
            [
                academic_year,
                term,
                amount_due,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE FEE
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM fees
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = FeeModel;
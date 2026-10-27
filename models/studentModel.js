const db = require("../config/db");

class StudentModel {

    // ==========================================
    // GET ALL STUDENTS
    // ==========================================

    static async getAll() {
        const [rows] = await db.query(`
            SELECT
                s.id,
                s.admission_number,
                s.first_name,
                s.last_name,
                s.gender,
                s.dob,
                s.class_id,
                c.class_name,
                s.status,
                s.created_at
            FROM students s
            LEFT JOIN classes c
                ON s.class_id = c.id
            ORDER BY s.id ASC
        `);

        return rows;
    }


    // ==========================================
    // GET STUDENT BY ID
    // ==========================================

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT
                s.id,
                s.admission_number,
                s.first_name,
                s.last_name,
                s.gender,
                s.dob,
                s.class_id,
                c.class_name,
                s.status,
                s.created_at
            FROM students s
            LEFT JOIN classes c
                ON s.class_id = c.id
            WHERE s.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // CREATE STUDENT
    // ==========================================

    static async create(student) {
        const {
            admission_number,
            first_name,
            last_name,
            gender,
            dob,
            class_id
        } = student;

        // Check class if provided
        if (class_id !== null && class_id !== undefined) {
            const [classes] = await db.query(
                `SELECT id FROM classes WHERE id = ?`,
                [class_id]
            );

            if (classes.length === 0) {
                return {
                    success: false,
                    reason: "CLASS_NOT_FOUND"
                };
            }
        }

        const [result] = await db.query(
            `INSERT INTO students
            (
                admission_number,
                first_name,
                last_name,
                gender,
                dob,
                class_id
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                admission_number,
                first_name,
                last_name,
                gender,
                dob || null,
                class_id || null
            ]
        );

        return {
            success: true,
            id: result.insertId
        };
    }


    // ==========================================
    // UPDATE STUDENT
    // ==========================================

    static async update(id, student) {
        const {
            admission_number,
            first_name,
            last_name,
            gender,
            dob,
            class_id
        } = student;

        // Check class if provided
        if (class_id !== null && class_id !== undefined) {
            const [classes] = await db.query(
                `SELECT id FROM classes WHERE id = ?`,
                [class_id]
            );

            if (classes.length === 0) {
                return {
                    success: false,
                    reason: "CLASS_NOT_FOUND"
                };
            }
        }

        const [result] = await db.query(
            `UPDATE students
             SET
                admission_number = ?,
                first_name = ?,
                last_name = ?,
                gender = ?,
                dob = ?,
                class_id = ?
             WHERE id = ?`,
            [
                admission_number,
                first_name,
                last_name,
                gender,
                dob || null,
                class_id || null,
                id
            ]
        );

        return {
            success: true,
            affectedRows: result.affectedRows
        };
    }


    // ==========================================
    // ASSIGN STUDENT TO CLASS
    // ==========================================

    static async assignClass(studentId, classId) {

        // Check student
        const [students] = await db.query(
            `SELECT id FROM students WHERE id = ?`,
            [studentId]
        );

        if (students.length === 0) {
            return {
                success: false,
                reason: "STUDENT_NOT_FOUND"
            };
        }

        // Check class
        const [classes] = await db.query(
            `SELECT id FROM classes WHERE id = ?`,
            [classId]
        );

        if (classes.length === 0) {
            return {
                success: false,
                reason: "CLASS_NOT_FOUND"
            };
        }

        await db.query(
            `UPDATE students
             SET class_id = ?
             WHERE id = ?`,
            [classId, studentId]
        );

        return {
            success: true
        };
    }


    // ==========================================
    // REMOVE STUDENT FROM CLASS
    // ==========================================

    static async removeFromClass(studentId) {

        const [result] = await db.query(
            `UPDATE students
             SET class_id = NULL
             WHERE id = ?`,
            [studentId]
        );

        return result.affectedRows;
    }


    // ==========================================
    // UPDATE STUDENT STATUS
    // ==========================================

    static async updateStatus(id, status) {

        const [result] = await db.query(
            `UPDATE students
             SET status = ?
             WHERE id = ?`,
            [status, id]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE STUDENT
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `DELETE FROM students
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows;
    }
}


module.exports = StudentModel;
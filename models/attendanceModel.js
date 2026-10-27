const db = require("../config/db");

class AttendanceModel {

    // ==========================================
    // GET ALL ATTENDANCE
    // ==========================================

    static async getAll() {

        const [rows] = await db.query(`
            SELECT
                a.id,
                a.student_id,
                s.admission_number,
                CONCAT(
                    s.first_name,
                    ' ',
                    s.last_name
                ) AS student_name,

                s.class_id,
                c.class_name,

                a.attendance_date,
                a.status,
                a.recorded_by,
                u.name AS recorded_by_name,
                a.remarks,

                a.created_at,
                a.updated_at

            FROM attendance a

            INNER JOIN students s
                ON a.student_id = s.id

            LEFT JOIN classes c
                ON s.class_id = c.id

            INNER JOIN users u
                ON a.recorded_by = u.id

            ORDER BY
                a.attendance_date DESC,
                a.id DESC
        `);

        return rows;
    }


    // ==========================================
    // GET ATTENDANCE BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                a.id,
                a.student_id,
                s.admission_number,
                CONCAT(
                    s.first_name,
                    ' ',
                    s.last_name
                ) AS student_name,

                s.class_id,
                c.class_name,

                a.attendance_date,
                a.status,
                a.recorded_by,
                u.name AS recorded_by_name,
                a.remarks,

                a.created_at,
                a.updated_at

            FROM attendance a

            INNER JOIN students s
                ON a.student_id = s.id

            LEFT JOIN classes c
                ON s.class_id = c.id

            INNER JOIN users u
                ON a.recorded_by = u.id

            WHERE a.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // GET STUDENT ATTENDANCE
    // ==========================================

    static async getByStudent(studentId) {

        const [rows] = await db.query(`
            SELECT
                a.id,
                a.student_id,
                s.admission_number,
                CONCAT(
                    s.first_name,
                    ' ',
                    s.last_name
                ) AS student_name,

                a.attendance_date,
                a.status,
                a.recorded_by,
                u.name AS recorded_by_name,
                a.remarks

            FROM attendance a

            INNER JOIN students s
                ON a.student_id = s.id

            INNER JOIN users u
                ON a.recorded_by = u.id

            WHERE a.student_id = ?

            ORDER BY a.attendance_date DESC
        `, [studentId]);

        return rows;
    }


    // ==========================================
    // GET ATTENDANCE BY DATE
    // ==========================================

    static async getByDate(date) {

        const [rows] = await db.query(`
            SELECT
                a.id,
                a.student_id,
                s.admission_number,
                CONCAT(
                    s.first_name,
                    ' ',
                    s.last_name
                ) AS student_name,

                s.class_id,
                c.class_name,

                a.attendance_date,
                a.status,

                a.recorded_by,
                u.name AS recorded_by_name,

                a.remarks

            FROM attendance a

            INNER JOIN students s
                ON a.student_id = s.id

            LEFT JOIN classes c
                ON s.class_id = c.id

            INNER JOIN users u
                ON a.recorded_by = u.id

            WHERE a.attendance_date = ?

            ORDER BY student_name ASC
        `, [date]);

        return rows;
    }


    // ==========================================
    // CREATE ATTENDANCE
    // ==========================================

    static async create(attendance) {

        const {
            student_id,
            attendance_date,
            status,
            recorded_by,
            remarks
        } = attendance;


        const [result] = await db.query(
            `
            INSERT INTO attendance
            (
                student_id,
                attendance_date,
                status,
                recorded_by,
                remarks
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                student_id,
                attendance_date,
                status,
                recorded_by,
                remarks || null
            ]
        );


        return result.insertId;
    }


    // ==========================================
    // UPDATE ATTENDANCE
    // ==========================================

    static async update(id, attendance) {

        const {
            attendance_date,
            status,
            remarks
        } = attendance;


        const [result] = await db.query(
            `
            UPDATE attendance
            SET
                attendance_date = ?,
                status = ?,
                remarks = ?
            WHERE id = ?
            `,
            [
                attendance_date,
                status,
                remarks || null,
                id
            ]
        );


        return result.affectedRows;
    }


    // ==========================================
    // DELETE ATTENDANCE
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM attendance
            WHERE id = ?
            `,
            [id]
        );


        return result.affectedRows;
    }
}


module.exports = AttendanceModel;
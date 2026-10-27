const db = require("../config/db");

class TimetableModel {

    // ==========================================
    // GET ALL TIMETABLE ENTRIES
    // ==========================================

    static async getAll() {

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.class_id,
                c.class_name,
                t.subject_id,
                s.subject_name,
                t.teacher_id,
                u.name AS teacher_name,
                t.day_of_week,
                t.start_time,
                t.end_time,
                t.room,
                t.created_at,
                t.updated_at
            FROM timetable t

            INNER JOIN classes c
                ON t.class_id = c.id

            INNER JOIN subjects s
                ON t.subject_id = s.id

            INNER JOIN users u
                ON t.teacher_id = u.id

            ORDER BY
                t.class_id ASC,
                FIELD(
                    t.day_of_week,
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday'
                ),
                t.start_time ASC
        `);

        return rows;
    }


    // ==========================================
    // GET TIMETABLE ENTRY BY ID
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.class_id,
                c.class_name,
                t.subject_id,
                s.subject_name,
                t.teacher_id,
                u.name AS teacher_name,
                t.day_of_week,
                t.start_time,
                t.end_time,
                t.room,
                t.created_at,
                t.updated_at
            FROM timetable t

            INNER JOIN classes c
                ON t.class_id = c.id

            INNER JOIN subjects s
                ON t.subject_id = s.id

            INNER JOIN users u
                ON t.teacher_id = u.id

            WHERE t.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // GET TIMETABLE BY CLASS
    // ==========================================

    static async getByClass(classId) {

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.class_id,
                c.class_name,
                t.subject_id,
                s.subject_name,
                t.teacher_id,
                u.name AS teacher_name,
                t.day_of_week,
                t.start_time,
                t.end_time,
                t.room,
                t.created_at,
                t.updated_at
            FROM timetable t

            INNER JOIN classes c
                ON t.class_id = c.id

            INNER JOIN subjects s
                ON t.subject_id = s.id

            INNER JOIN users u
                ON t.teacher_id = u.id

            WHERE t.class_id = ?

            ORDER BY
                FIELD(
                    t.day_of_week,
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday'
                ),
                t.start_time ASC
        `, [classId]);

        return rows;
    }


    // ==========================================
    // GET TIMETABLE BY TEACHER
    // ==========================================

    static async getByTeacher(teacherId) {

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.class_id,
                c.class_name,
                t.subject_id,
                s.subject_name,
                t.teacher_id,
                u.name AS teacher_name,
                t.day_of_week,
                t.start_time,
                t.end_time,
                t.room,
                t.created_at,
                t.updated_at
            FROM timetable t

            INNER JOIN classes c
                ON t.class_id = c.id

            INNER JOIN subjects s
                ON t.subject_id = s.id

            INNER JOIN users u
                ON t.teacher_id = u.id

            WHERE t.teacher_id = ?

            ORDER BY
                FIELD(
                    t.day_of_week,
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday'
                ),
                t.start_time ASC
        `, [teacherId]);

        return rows;
    }


    // ==========================================
    // CREATE TIMETABLE ENTRY
    // ==========================================

    static async create(data) {

        const {
            class_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO timetable
            (
                class_id,
                subject_id,
                teacher_id,
                day_of_week,
                start_time,
                end_time,
                room
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                class_id,
                subject_id,
                teacher_id,
                day_of_week,
                start_time,
                end_time,
                room || null
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE TIMETABLE ENTRY
    // ==========================================

    static async update(id, data) {

        const {
            class_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room
        } = data;

        const [result] = await db.query(
            `
            UPDATE timetable
            SET
                class_id = ?,
                subject_id = ?,
                teacher_id = ?,
                day_of_week = ?,
                start_time = ?,
                end_time = ?,
                room = ?
            WHERE id = ?
            `,
            [
                class_id,
                subject_id,
                teacher_id,
                day_of_week,
                start_time,
                end_time,
                room || null,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE TIMETABLE ENTRY
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM timetable
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = TimetableModel;

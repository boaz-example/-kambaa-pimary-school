const db = require("../config/db");

class ClassModel {

    // ==========================================
    // GET ALL CLASSES
    // ==========================================

    static async getAll() {

        const [rows] = await db.query(`
            SELECT
                c.id,
                c.class_name,
                c.class_teacher_id,
                u.name AS class_teacher,
                c.created_at
            FROM classes c
            LEFT JOIN users u
                ON c.class_teacher_id = u.id
                AND u.role = 'teacher'
            ORDER BY c.id ASC
        `);

        return rows;
    }


    // ==========================================
    // GET ONE CLASS
    // ==========================================

    static async getById(id) {

        const [rows] = await db.query(`
            SELECT
                c.id,
                c.class_name,
                c.class_teacher_id,
                u.name AS class_teacher,
                c.created_at
            FROM classes c
            LEFT JOIN users u
                ON c.class_teacher_id = u.id
                AND u.role = 'teacher'
            WHERE c.id = ?
        `, [id]);

        return rows[0];
    }


    // ==========================================
    // CREATE CLASS
    // ==========================================

    static async create(classData) {

        const {
            class_name,
            class_teacher_id
        } = classData;

        const [result] = await db.query(
            `INSERT INTO classes
            (class_name, class_teacher_id)
            VALUES (?, ?)`,
            [
                class_name,
                class_teacher_id || null
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // UPDATE CLASS
    // ==========================================

    static async update(id, classData) {

        const {
            class_name,
            class_teacher_id
        } = classData;

        const [result] = await db.query(
            `UPDATE classes
             SET class_name = ?,
                 class_teacher_id = ?
             WHERE id = ?`,
            [
                class_name,
                class_teacher_id || null,
                id
            ]
        );

        return result.affectedRows;
    }


    // ==========================================
    // ASSIGN TEACHER TO CLASS
    // ==========================================

    static async assignTeacher(classId, teacherId) {

        // First verify that the user exists
        // and has the teacher role.

        const [teachers] = await db.query(
            `SELECT id
             FROM users
             WHERE id = ?
             AND role = 'teacher'
             AND status = 'active'`,
            [teacherId]
        );

        if (teachers.length === 0) {
            return {
                success: false,
                reason: "TEACHER_NOT_FOUND"
            };
        }


        // Verify that the class exists.

        const [classes] = await db.query(
            `SELECT id
             FROM classes
             WHERE id = ?`,
            [classId]
        );

        if (classes.length === 0) {
            return {
                success: false,
                reason: "CLASS_NOT_FOUND"
            };
        }


        // Assign teacher.

        await db.query(
            `UPDATE classes
             SET class_teacher_id = ?
             WHERE id = ?`,
            [teacherId, classId]
        );


        return {
            success: true
        };
    }


    // ==========================================
    // REMOVE TEACHER FROM CLASS
    // ==========================================

    static async removeTeacher(classId) {

        const [result] = await db.query(
            `UPDATE classes
             SET class_teacher_id = NULL
             WHERE id = ?`,
            [classId]
        );

        return result.affectedRows;
    }


    // ==========================================
    // DELETE CLASS
    // ==========================================

    static async delete(id) {

        const [result] = await db.query(
            `DELETE FROM classes
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = ClassModel;
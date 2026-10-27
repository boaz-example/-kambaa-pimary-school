const db = require("../config/db");

class ParentStudentModel {

    // ==========================================
    // GET ALL STUDENTS BELONGING TO A PARENT
    // parent_id = users.id
    // ==========================================

    static async getStudentsByParent(parentId) {

        const [rows] = await db.query(`
            SELECT
                s.id AS student_id,
                s.admission_number,
                s.first_name,
                s.last_name,
                s.gender,
                s.dob,
                s.class_id,
                c.class_name,
                s.status,
                s.parent_id

            FROM students s

            LEFT JOIN classes c
                ON s.class_id = c.id

            WHERE s.parent_id = ?

            ORDER BY s.first_name ASC
        `, [parentId]);

        return rows;
    }


    // ==========================================
    // GET PARENT'S STUDENTS
    // Uses the authenticated user's ID
    // ==========================================

    static async getMyChildren(parentId) {

        return await this.getStudentsByParent(parentId);
    }


    // ==========================================
    // LINK STUDENT TO PARENT
    // ADMIN ONLY
    // ==========================================

    static async linkStudentToParent(studentId, parentId) {

        const [result] = await db.query(`
            UPDATE students
            SET parent_id = ?
            WHERE id = ?
        `, [
            parentId,
            studentId
        ]);

        return result.affectedRows;
    }


    // ==========================================
    // REMOVE STUDENT FROM PARENT
    // ==========================================

    static async unlinkStudentFromParent(studentId) {

        const [result] = await db.query(`
            UPDATE students
            SET parent_id = NULL
            WHERE id = ?
        `, [studentId]);

        return result.affectedRows;
    }
}

module.exports = ParentStudentModel;
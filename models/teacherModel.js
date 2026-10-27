const db = require("../config/db");

class TeacherModel {

    // GET ALL TEACHERS
    static async getAll() {
        const [rows] = await db.query(`
            SELECT
                t.id,
                t.user_id,
                u.name,
                u.email,
                u.phone,
                u.status,
                t.employee_number,
                t.qualification,
                t.specialization,
                t.hire_date,
                t.created_at
            FROM teachers t
            INNER JOIN users u ON t.user_id = u.id
            WHERE u.role = 'teacher'
            ORDER BY t.id ASC
        `);

        return rows;
    }


    // GET TEACHER BY ID
    static async getById(id) {
        const [rows] = await db.query(`
            SELECT
                t.id,
                t.user_id,
                u.name,
                u.email,
                u.phone,
                u.status,
                t.employee_number,
                t.qualification,
                t.specialization,
                t.hire_date,
                t.created_at
            FROM teachers t
            INNER JOIN users u ON t.user_id = u.id
            WHERE t.id = ?
              AND u.role = 'teacher'
        `, [id]);

        return rows[0];
    }


    // CREATE USER + TEACHER PROFILE
    static async create(data) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            // Create user account
            const [userResult] = await connection.query(`
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role,
                    phone,
                    status
                )
                VALUES (?, ?, ?, 'teacher', ?, 'active')
            `, [
                data.name,
                data.email,
                data.password,
                data.phone || null
            ]);

            const userId = userResult.insertId;


            // Create teacher profile
            const [teacherResult] = await connection.query(`
                INSERT INTO teachers
                (
                    user_id,
                    employee_number,
                    qualification,
                    specialization,
                    hire_date
                )
                VALUES (?, ?, ?, ?, ?)
            `, [
                userId,
                data.employee_number,
                data.qualification || null,
                data.specialization || null,
                data.hire_date || null
            ]);


            await connection.commit();

            return {
                userId,
                teacherId: teacherResult.insertId
            };

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();

        }
    }


    // UPDATE TEACHER
    static async update(id, data) {

        const [result] = await db.query(`
            UPDATE teachers
            SET
                employee_number = ?,
                qualification = ?,
                specialization = ?,
                hire_date = ?
            WHERE id = ?
        `, [
            data.employee_number,
            data.qualification || null,
            data.specialization || null,
            data.hire_date || null,
            id
        ]);

        return result.affectedRows;
    }


    // DELETE TEACHER
    static async delete(id) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            // Find user belonging to teacher
            const [rows] = await connection.query(
                "SELECT user_id FROM teachers WHERE id = ?",
                [id]
            );

            if (rows.length === 0) {
                await connection.rollback();
                return 0;
            }

            const userId = rows[0].user_id;

            // Delete teacher profile
            await connection.query(
                "DELETE FROM teachers WHERE id = ?",
                [id]
            );

            // Delete associated user account
            await connection.query(
                "DELETE FROM users WHERE id = ? AND role = 'teacher'",
                [userId]
            );

            await connection.commit();

            return 1;

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();

        }
    }
}

module.exports = TeacherModel;
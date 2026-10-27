const db = require("../config/db");

class SubjectModel {

    // GET ALL SUBJECTS
    static async getAll() {
        const [rows] = await db.query(
            "SELECT id, subject_name, created_at FROM subjects ORDER BY id ASC"
        );

        return rows;
    }

    // GET SUBJECT BY ID
    static async getById(id) {
        const [rows] = await db.query(
            "SELECT id, subject_name, created_at FROM subjects WHERE id = ?",
            [id]
        );

        return rows[0];
    }

    // CREATE SUBJECT
    static async create(subjectName) {
        const [result] = await db.query(
            "INSERT INTO subjects (subject_name) VALUES (?)",
            [subjectName]
        );

        return result.insertId;
    }

    // UPDATE SUBJECT
    static async update(id, subjectName) {
        const [result] = await db.query(
            "UPDATE subjects SET subject_name = ? WHERE id = ?",
            [subjectName, id]
        );

        return result.affectedRows;
    }

    // DELETE SUBJECT
    static async delete(id) {
        const [result] = await db.query(
            "DELETE FROM subjects WHERE id = ?",
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = SubjectModel;
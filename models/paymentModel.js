
const db = require("../config/db");

const ALLOWED_METHODS = [
    "Cash",
    "M-Pesa",
    "Bank",
    "Cheque",
    "Other"
];

class PaymentModel {
    static async getAll() {
        const [rows] = await db.query(`
            SELECT p.*,
                   s.admission_number,
                   CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                   f.term, f.academic_year,
                   u.name AS received_by_name
            FROM payments p
            INNER JOIN students s ON p.student_id = s.id
            INNER JOIN fees f ON p.fee_id = f.id
            INNER JOIN users u ON p.received_by = u.id
            ORDER BY p.payment_date DESC, p.id DESC
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT p.*,
                   s.admission_number,
                   CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                   f.term, f.academic_year,
                   u.name AS received_by_name
            FROM payments p
            INNER JOIN students s ON p.student_id = s.id
            INNER JOIN fees f ON p.fee_id = f.id
            INNER JOIN users u ON p.received_by = u.id
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    }

    static async getByStudent(studentId) {
        const [rows] = await db.query(`
            SELECT p.*,
                   s.admission_number,
                   CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                   f.term, f.academic_year,
                   u.name AS received_by_name
            FROM payments p
            INNER JOIN students s ON p.student_id = s.id
            INNER JOIN fees f ON p.fee_id = f.id
            INNER JOIN users u ON p.received_by = u.id
            WHERE p.student_id = ?
            ORDER BY p.payment_date DESC, p.id DESC
        `, [studentId]);
        return rows;
    }

    static async getByFee(feeId) {
        const [rows] = await db.query(`
            SELECT p.*,
                   f.term, f.academic_year,
                   u.name AS received_by_name
            FROM payments p
            INNER JOIN fees f ON p.fee_id = f.id
            INNER JOIN users u ON p.received_by = u.id
            WHERE p.fee_id = ?
            ORDER BY p.payment_date DESC, p.id DESC
        `, [feeId]);
        return rows;
    }

    static async create(payment) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [fees] = await connection.query(
                "SELECT id, student_id, amount_due FROM fees WHERE id = ? FOR UPDATE",
                [payment.fee_id]
            );

            const fee = fees[0];

            if (!fee) {
                throw new Error("FEE_NOT_FOUND");
            }

            if (Number(fee.student_id) !== Number(payment.student_id)) {
                throw new Error("STUDENT_FEE_MISMATCH");
            }

            const [totals] = await connection.query(`
                SELECT COALESCE(SUM(amount_paid), 0) AS total_paid
                FROM payments
                WHERE fee_id = ?
            `, [payment.fee_id]);

            const balance =
                Number(fee.amount_due) - Number(totals[0].total_paid);

            if (Number(payment.amount_paid) > balance + 0.000001) {
                throw new Error("INSUFFICIENT_BALANCE");
            }

            const [result] = await connection.query(`
                INSERT INTO payments (
                    student_id, fee_id, amount_paid, payment_date,
                    payment_method, reference_number, received_by, remarks
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                payment.student_id,
                payment.fee_id,
                payment.amount_paid,
                payment.payment_date,
                payment.payment_method,
                payment.reference_number || null,
                payment.received_by,
                payment.remarks || null
            ]);

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, payment) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [existingRows] = await connection.query(
                "SELECT id, fee_id, payment_method FROM payments WHERE id = ? FOR UPDATE",
                [id]
            );

            const existing = existingRows[0];

            if (!existing) {
                throw new Error("PAYMENT_NOT_FOUND");
            }

            if (existing.payment_method === "M-Pesa") {
                throw new Error("MPESA_UPDATE_REQUIRES_VERIFICATION");
            }

            await connection.query(
                "SELECT id FROM fees WHERE id = ? FOR UPDATE",
                [existing.fee_id]
            );

            const [feeRows] = await connection.query(
                "SELECT amount_due FROM fees WHERE id = ?",
                [existing.fee_id]
            );

            if (!feeRows[0]) {
                throw new Error("FEE_NOT_FOUND");
            }

            const [totals] = await connection.query(`
                SELECT COALESCE(SUM(amount_paid), 0) AS total_paid
                FROM payments
                WHERE fee_id = ? AND id <> ?
            `, [existing.fee_id, id]);

            const balance =
                Number(feeRows[0].amount_due) - Number(totals[0].total_paid);

            if (Number(payment.amount_paid) > balance + 0.000001) {
                throw new Error("INSUFFICIENT_BALANCE");
            }

            await connection.query(`
                UPDATE payments
                SET amount_paid = ?, payment_date = ?, payment_method = ?,
                    reference_number = ?, remarks = ?
                WHERE id = ?
            `, [
                payment.amount_paid,
                payment.payment_date,
                payment.payment_method,
                payment.reference_number || null,
                payment.remarks || null,
                id
            ]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [rows] = await connection.query(
                "SELECT id, payment_method FROM payments WHERE id = ? FOR UPDATE",
                [id]
            );

            if (!rows[0]) {
                throw new Error("PAYMENT_NOT_FOUND");
            }

            if (rows[0].payment_method === "M-Pesa") {
                throw new Error("MPESA_DELETE_REQUIRES_VERIFICATION");
            }

            await connection.query(
                "SELECT id FROM fees WHERE id = (SELECT fee_id FROM payments WHERE id = ?) FOR UPDATE",
                [id]
            );

            await connection.query(
                "DELETE FROM payments WHERE id = ?",
                [id]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

PaymentModel.ALLOWED_METHODS = ALLOWED_METHODS;

module.exports = PaymentModel;


const Payment = require("../models/paymentModel");
const Fee = require("../models/feeModel");

const ALLOWED_METHODS = [
    "Cash",
    "M-Pesa",
    "Bank",
    "Cheque",
    "Other"
];

function validId(value) {
    return /^\d+$/.test(String(value)) && Number(value) > 0;
}

function validAmount(value) {
    return value !== "" &&
        value !== null &&
        value !== undefined &&
        Number.isFinite(Number(value)) &&
        Number(value) > 0 &&
        /^\d+(\.\d{1,2})?$/.test(String(value));
}

function validDate(value) {
    if (typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value;
}

function handleError(res, error, fallback) {
    const messages = {
        PAYMENT_NOT_FOUND: [404, "Payment not found."],
        FEE_NOT_FOUND: [404, "Fee record not found."],
        STUDENT_FEE_MISMATCH: [400, "The student does not match this fee record."],
        INSUFFICIENT_BALANCE: [400, "Payment exceeds the outstanding balance."],
        MPESA_UPDATE_REQUIRES_VERIFICATION: [403, "M-Pesa payments cannot be edited through manual payment routes."],
        MPESA_DELETE_REQUIRES_VERIFICATION: [403, "M-Pesa payments cannot be deleted through manual payment routes."]
    };

    const known = messages[error.message];

    if (known) {
        return res.status(known[0]).json({
            success: false,
            message: known[1]
        });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
            success: false,
            message: "A referenced student, fee or user does not exist."
        });
    }

    console.error(fallback, error);

    return res.status(500).json({
        success: false,
        message: fallback
    });
}

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.getAll();
        res.json({ success: true, count: payments.length, payments });
    } catch (error) {
        handleError(res, error, "Failed to retrieve payments.");
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid payment ID." });
        }

        const payment = await Payment.getById(req.params.id);

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found." });
        }

        res.json({ success: true, payment });
    } catch (error) {
        handleError(res, error, "Failed to retrieve payment.");
    }
};

exports.getStudentPayments = async (req, res) => {
    try {
        if (!validId(req.params.studentId)) {
            return res.status(400).json({ success: false, message: "Invalid student ID." });
        }

        const payments = await Payment.getByStudent(req.params.studentId);
        res.json({ success: true, count: payments.length, payments });
    } catch (error) {
        handleError(res, error, "Failed to retrieve student payments.");
    }
};

exports.getFeePayments = async (req, res) => {
    try {
        if (!validId(req.params.feeId)) {
            return res.status(400).json({ success: false, message: "Invalid fee ID." });
        }

        const payments = await Payment.getByFee(req.params.feeId);
        res.json({ success: true, count: payments.length, payments });
    } catch (error) {
        handleError(res, error, "Failed to retrieve fee payments.");
    }
};

exports.createPayment = async (req, res) => {
    try {
        const {
            student_id,
            fee_id,
            amount_paid,
            payment_date,
            payment_method,
            reference_number,
            remarks
        } = req.body;

        if (!validId(student_id) || !validId(fee_id) ||
            !validAmount(amount_paid) || !validDate(payment_date) ||
            !ALLOWED_METHODS.includes(payment_method)) {
            return res.status(400).json({
                success: false,
                message: "Provide valid student ID, fee ID, positive amount, date and payment method."
            });
        }

        if (payment_method === "M-Pesa") {
            return res.status(400).json({
                success: false,
                message: "M-Pesa payments must be confirmed through the verified M-Pesa integration. Do not record them manually."
            });
        }

        if (reference_number != null &&
            (typeof reference_number !== "string" || reference_number.length > 100)) {
            return res.status(400).json({
                success: false,
                message: "Reference number must be at most 100 characters."
            });
        }

        if (remarks != null &&
            (typeof remarks !== "string" || remarks.length > 255)) {
            return res.status(400).json({
                success: false,
                message: "Remarks must be at most 255 characters."
            });
        }

        const fee = await Fee.getById(fee_id);

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: "Fee record not found."
            });
        }

        if (Number(fee.student_id) !== Number(student_id)) {
            return res.status(400).json({
                success: false,
                message: "The student does not match this fee record."
            });
        }

        const paymentId = await Payment.create({
            student_id: Number(student_id),
            fee_id: Number(fee_id),
            amount_paid: Number(amount_paid),
            payment_date,
            payment_method,
            reference_number: reference_number || null,
            received_by: req.user.id,
            remarks: remarks || null
        });

        const payment = await Payment.getById(paymentId);

        res.status(201).json({
            success: true,
            message: "Payment recorded successfully.",
            payment
        });
    } catch (error) {
        handleError(res, error, "Failed to record payment.");
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            amount_paid,
            payment_date,
            payment_method,
            reference_number,
            remarks
        } = req.body;

        if (!validId(id) || !validAmount(amount_paid) ||
            !validDate(payment_date) ||
            !ALLOWED_METHODS.includes(payment_method)) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid payment ID, positive amount, date and payment method."
            });
        }

        if (payment_method === "M-Pesa") {
            return res.status(400).json({
                success: false,
                message: "M-Pesa payments cannot be created or converted through the manual payment route."
            });
        }

        if (reference_number != null &&
            (typeof reference_number !== "string" || reference_number.length > 100)) {
            return res.status(400).json({
                success: false,
                message: "Reference number must be at most 100 characters."
            });
        }

        if (remarks != null &&
            (typeof remarks !== "string" || remarks.length > 255)) {
            return res.status(400).json({
                success: false,
                message: "Remarks must be at most 255 characters."
            });
        }

        const existing = await Payment.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });
        }

        await Payment.update(id, {
            amount_paid: Number(amount_paid),
            payment_date,
            payment_method,
            reference_number: reference_number || null,
            remarks: remarks || null
        });

        const payment = await Payment.getById(id);

        res.json({
            success: true,
            message: "Payment updated successfully.",
            payment
        });
    } catch (error) {
        handleError(res, error, "Failed to update payment.");
    }
};

exports.deletePayment = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid payment ID." });
        }

        const existing = await Payment.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });
        }

        await Payment.delete(req.params.id);

        res.json({
            success: true,
            message: "Payment deleted successfully."
        });
    } catch (error) {
        handleError(res, error, "Failed to delete payment.");
    }
};

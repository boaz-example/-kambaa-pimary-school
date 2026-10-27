const Fee = require("../models/feeModel");


// ==========================================
// GET ALL FEES
// ==========================================

exports.getAllFees = async (req, res) => {
    try {
        const fees = await Fee.getAll();

        res.json({
            success: true,
            count: fees.length,
            fees
        });

    } catch (error) {
        console.error("Get fees error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve fees."
        });
    }
};


// ==========================================
// GET FEE BY ID
// ==========================================

exports.getFeeById = async (req, res) => {
    try {
        const fee = await Fee.getById(req.params.id);

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: "Fee record not found."
            });
        }

        res.json({
            success: true,
            fee
        });

    } catch (error) {
        console.error("Get fee error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve fee."
        });
    }
};


// ==========================================
// GET STUDENT FEES
// ==========================================

exports.getStudentFees = async (req, res) => {
    try {
        const fees = await Fee.getByStudent(req.params.studentId);

        res.json({
            success: true,
            count: fees.length,
            fees
        });

    } catch (error) {
        console.error("Get student fees error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve student fees."
        });
    }
};


// ==========================================
// CREATE FEE
// ADMIN ONLY
// ==========================================

exports.createFee = async (req, res) => {
    try {
        const {
            student_id,
            academic_year,
            term,
            amount_due
        } = req.body;

        if (
            !student_id ||
            !academic_year ||
            !term ||
            amount_due === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Student, academic year, term and amount due are required."
            });
        }

        if (Number(amount_due) < 0) {
            return res.status(400).json({
                success: false,
                message: "Amount due cannot be negative."
            });
        }

        const allowedTerms = [
            "Term 1",
            "Term 2",
            "Term 3"
        ];

        if (!allowedTerms.includes(term)) {
            return res.status(400).json({
                success: false,
                message: "Invalid term."
            });
        }

        const feeId = await Fee.create({
            student_id,
            academic_year,
            term,
            amount_due
        });

        const fee = await Fee.getById(feeId);

        res.status(201).json({
            success: true,
            message: "Fee record created successfully.",
            fee
        });

    } catch (error) {
        console.error("Create fee error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "A fee record already exists for this student, year and term."
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                success: false,
                message: "The specified student does not exist."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create fee."
        });
    }
};


// ==========================================
// UPDATE FEE
// ADMIN ONLY
// ==========================================

exports.updateFee = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Fee.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Fee record not found."
            });
        }

        const {
            academic_year,
            term,
            amount_due
        } = req.body;

        if (
            !academic_year ||
            !term ||
            amount_due === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Academic year, term and amount due are required."
            });
        }

        if (Number(amount_due) < 0) {
            return res.status(400).json({
                success: false,
                message: "Amount due cannot be negative."
            });
        }

        const allowedTerms = [
            "Term 1",
            "Term 2",
            "Term 3"
        ];

        if (!allowedTerms.includes(term)) {
            return res.status(400).json({
                success: false,
                message: "Invalid term."
            });
        }

        await Fee.update(id, {
            academic_year,
            term,
            amount_due
        });

        const fee = await Fee.getById(id);

        res.json({
            success: true,
            message: "Fee updated successfully.",
            fee
        });

    } catch (error) {
        console.error("Update fee error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update fee."
        });
    }
};


// ==========================================
// DELETE FEE
// ADMIN ONLY
// ==========================================

exports.deleteFee = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Fee.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Fee record not found."
            });
        }

        await Fee.delete(id);

        res.json({
            success: true,
            message: "Fee deleted successfully."
        });

    } catch (error) {
        console.error("Delete fee error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete fee."
        });
    }
};
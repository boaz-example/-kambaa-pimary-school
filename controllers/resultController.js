const Result = require("../models/resultModel");


// ==========================================
// GET ALL RESULTS
// ==========================================

exports.getAllResults = async (req, res) => {
    try {

        const results = await Result.getAll();

        res.json({
            success: true,
            count: results.length,
            results
        });

    } catch (error) {

        console.error("Get results error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve results."
        });
    }
};


// ==========================================
// GET RESULT BY ID
// ==========================================

exports.getResultById = async (req, res) => {
    try {

        const result =
            await Result.getById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found."
            });
        }

        res.json({
            success: true,
            result
        });

    } catch (error) {

        console.error("Get result error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve result."
        });
    }
};


// ==========================================
// GET STUDENT RESULTS
// ==========================================

exports.getStudentResults = async (req, res) => {
    try {

        const results =
            await Result.getByStudent(
                req.params.studentId
            );

        res.json({
            success: true,
            count: results.length,
            results
        });

    } catch (error) {

        console.error(
            "Get student results error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve student results."
        });
    }
};


// ==========================================
// GET SUBJECT RESULTS
// ==========================================

exports.getSubjectResults = async (req, res) => {
    try {

        const results =
            await Result.getBySubject(
                req.params.subjectId
            );

        res.json({
            success: true,
            count: results.length,
            results
        });

    } catch (error) {

        console.error(
            "Get subject results error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve subject results."
        });
    }
};


// ==========================================
// CREATE RESULT
// TEACHER / ADMIN
// ==========================================

exports.createResult = async (req, res) => {
    try {

        const {
            student_id,
            subject_id,
            marks,
            term,
            academic_year
        } = req.body;

        if (
            !student_id ||
            !subject_id ||
            marks === undefined ||
            !term ||
            !academic_year
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Student, subject, marks, term and academic year are required."
            });
        }

        if (
            Number(marks) < 0 ||
            Number(marks) > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Marks must be between 0 and 100."
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

        const resultId =
            await Result.create({
                student_id,
                subject_id,
                marks,
                term,
                academic_year,
                teacher_id: req.user.id
            });

        const result =
            await Result.getById(resultId);

        res.status(201).json({
            success: true,
            message:
                "Result recorded successfully.",
            result
        });

    } catch (error) {

        console.error(
            "Create result error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "A result already exists for this student, subject, term and academic year."
            });
        }

        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Student, subject or teacher does not exist."
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to record result."
        });
    }
};


// ==========================================
// UPDATE RESULT
// TEACHER / ADMIN
// ==========================================

exports.updateResult = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Result.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Result not found."
            });
        }

        const {
            marks,
            term,
            academic_year
        } = req.body;

        if (
            marks === undefined ||
            !term ||
            !academic_year
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Marks, term and academic year are required."
            });
        }

        if (
            Number(marks) < 0 ||
            Number(marks) > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Marks must be between 0 and 100."
            });
        }

        await Result.update(id, {
            marks,
            term,
            academic_year
        });

        const result =
            await Result.getById(id);

        res.json({
            success: true,
            message:
                "Result updated successfully.",
            result
        });

    } catch (error) {

        console.error(
            "Update result error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update result."
        });
    }
};


// ==========================================
// DELETE RESULT
// ADMIN ONLY
// ==========================================

exports.deleteResult = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Result.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Result not found."
            });
        }

        await Result.delete(id);

        res.json({
            success: true,
            message:
                "Result deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete result error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete result."
        });
    }
};
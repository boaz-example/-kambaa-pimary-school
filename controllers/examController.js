const Exam = require("../models/examModel");


// ==========================================
// GET ALL EXAMS
// ==========================================

exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.getAll();

        res.json({
            success: true,
            count: exams.length,
            exams
        });

    } catch (error) {
        console.error("Get exams error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve exams."
        });
    }
};


// ==========================================
// GET EXAM BY ID
// ==========================================

exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.getById(req.params.id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found."
            });
        }

        res.json({
            success: true,
            exam
        });

    } catch (error) {
        console.error("Get exam error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve exam."
        });
    }
};


// ==========================================
// CREATE EXAM
// ADMIN ONLY
// ==========================================

exports.createExam = async (req, res) => {
    try {

        const {
            exam_name,
            academic_year,
            term,
            start_date,
            end_date
        } = req.body;

        if (!exam_name || !academic_year || !term) {
            return res.status(400).json({
                success: false,
                message:
                    "Exam name, academic year and term are required."
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

        const examId = await Exam.create({
            exam_name,
            academic_year,
            term,
            start_date,
            end_date,
            created_by: req.user.id
        });

        const exam = await Exam.getById(examId);

        res.status(201).json({
            success: true,
            message: "Exam created successfully.",
            exam
        });

    } catch (error) {
        console.error("Create exam error:", error);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                success: false,
                message: "The creating user does not exist."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create exam."
        });
    }
};


// ==========================================
// UPDATE EXAM
// ADMIN ONLY
// ==========================================

exports.updateExam = async (req, res) => {
    try {

        const { id } = req.params;

        const existing = await Exam.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Exam not found."
            });
        }

        const {
            exam_name,
            academic_year,
            term,
            start_date,
            end_date
        } = req.body;

        if (!exam_name || !academic_year || !term) {
            return res.status(400).json({
                success: false,
                message:
                    "Exam name, academic year and term are required."
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

        await Exam.update(id, {
            exam_name,
            academic_year,
            term,
            start_date,
            end_date
        });

        const exam = await Exam.getById(id);

        res.json({
            success: true,
            message: "Exam updated successfully.",
            exam
        });

    } catch (error) {
        console.error("Update exam error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update exam."
        });
    }
};


// ==========================================
// DELETE EXAM
// ADMIN ONLY
// ==========================================

exports.deleteExam = async (req, res) => {
    try {

        const { id } = req.params;

        const existing = await Exam.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Exam not found."
            });
        }

        await Exam.delete(id);

        res.json({
            success: true,
            message: "Exam deleted successfully."
        });

    } catch (error) {
        console.error("Delete exam error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete exam."
        });
    }
};
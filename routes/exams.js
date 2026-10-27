const express = require("express");
const router = express.Router();

const examController = require("../controllers/examController");
const { auth, authorize } = require("../middleware/auth");

// ==========================================
// GET ALL EXAMS
// ADMIN + TEACHER
// ==========================================

router.get(
    "/",
    auth,
    authorize("admin", "teacher"),
    examController.getAllExams
);

// ==========================================
// GET EXAM BY ID
// ADMIN + TEACHER
// ==========================================

router.get(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    examController.getExamById
);

// ==========================================
// CREATE EXAM
// ADMIN ONLY
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin"),
    examController.createExam
);

// ==========================================
// UPDATE EXAM
// ADMIN ONLY
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    examController.updateExam
);

// ==========================================
// DELETE EXAM
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    examController.deleteExam
);

module.exports = router;
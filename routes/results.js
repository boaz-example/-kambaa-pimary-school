const express = require("express");
const router = express.Router();

const resultController = require("../controllers/resultController");
const { auth, authorize } = require("../middleware/auth");

// ==========================================
// GET ALL RESULTS
// ADMIN + TEACHER
// ==========================================

router.get(
    "/",
    auth,
    authorize("admin", "teacher"),
    resultController.getAllResults
);

// ==========================================
// GET RESULT BY ID
// ADMIN + TEACHER
// ==========================================

router.get(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    resultController.getResultById
);

// ==========================================
// GET STUDENT RESULTS
// ADMIN + TEACHER
// ==========================================

router.get(
    "/student/:studentId",
    auth,
    authorize("admin", "teacher"),
    resultController.getStudentResults
);

// ==========================================
// GET SUBJECT RESULTS
// ADMIN + TEACHER
// ==========================================

router.get(
    "/subject/:subjectId",
    auth,
    authorize("admin", "teacher"),
    resultController.getSubjectResults
);

// ==========================================
// CREATE RESULT
// ADMIN + TEACHER
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin", "teacher"),
    resultController.createResult
);

// ==========================================
// UPDATE RESULT
// ADMIN + TEACHER
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    resultController.updateResult
);

// ==========================================
// DELETE RESULT
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    resultController.deleteResult
);

module.exports = router;
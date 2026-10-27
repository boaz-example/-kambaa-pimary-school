const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const { auth, authorize } = require("../middleware/auth");


// ==========================================
// GET ALL STUDENTS
// ==========================================

router.get(
    "/",
    auth,
    studentController.getAllStudents
);


// ==========================================
// GET ONE STUDENT
// ==========================================

router.get(
    "/:id",
    auth,
    studentController.getStudentById
);


// ==========================================
// CREATE STUDENT
// ADMIN ONLY
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin"),
    studentController.createStudent
);


// ==========================================
// UPDATE STUDENT
// ADMIN ONLY
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    studentController.updateStudent
);


// ==========================================
// ASSIGN STUDENT TO CLASS
// ADMIN ONLY
// ==========================================

router.post(
    "/:id/class",
    auth,
    authorize("admin"),
    studentController.assignStudentToClass
);


// ==========================================
// REMOVE STUDENT FROM CLASS
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id/class",
    auth,
    authorize("admin"),
    studentController.removeStudentFromClass
);


// ==========================================
// UPDATE STUDENT STATUS
// ADMIN ONLY
// ==========================================

router.patch(
    "/:id/status",
    auth,
    authorize("admin"),
    studentController.updateStudentStatus
);


// ==========================================
// DELETE STUDENT
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    studentController.deleteStudent
);


module.exports = router;
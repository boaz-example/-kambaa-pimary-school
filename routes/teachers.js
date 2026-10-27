const express = require("express");

const router = express.Router();

const teacherController = require("../controllers/teacherController");

const { auth, authorize } = require("../middleware/auth");


// ==========================================
// GET ALL TEACHERS
// Admin + Teacher
// ==========================================

router.get(
    "/",
    auth,
    authorize("admin", "teacher"),
    teacherController.getAllTeachers
);


// ==========================================
// GET ONE TEACHER
// Admin + Teacher
// ==========================================

router.get(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    teacherController.getTeacherById
);


// ==========================================
// CREATE TEACHER
// Admin only
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin"),
    teacherController.createTeacher
);


// ==========================================
// UPDATE TEACHER
// Admin only
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    teacherController.updateTeacher
);


// ==========================================
// DELETE TEACHER
// Admin only
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    teacherController.deleteTeacher
);


module.exports = router;
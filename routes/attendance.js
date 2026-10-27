const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const { auth, authorize } = require("../middleware/auth");


// ==========================================
// GET ALL ATTENDANCE
// ADMIN / TEACHER
// ==========================================

router.get(
    "/",
    auth,
    authorize("admin", "teacher"),
    attendanceController.getAllAttendance
);


// ==========================================
// GET ATTENDANCE BY ID
// ADMIN / TEACHER
// ==========================================

router.get(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    attendanceController.getAttendanceById
);


// ==========================================
// GET STUDENT ATTENDANCE
// ADMIN / TEACHER
// ==========================================

router.get(
    "/student/:studentId",
    auth,
    authorize("admin", "teacher"),
    attendanceController.getStudentAttendance
);


// ==========================================
// GET ATTENDANCE BY DATE
// ADMIN / TEACHER
// ==========================================

router.get(
    "/date/:date",
    auth,
    authorize("admin", "teacher"),
    attendanceController.getAttendanceByDate
);


// ==========================================
// CREATE ATTENDANCE
// ADMIN / TEACHER
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin", "teacher"),
    attendanceController.createAttendance
);


// ==========================================
// UPDATE ATTENDANCE
// ADMIN / TEACHER
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    attendanceController.updateAttendance
);


// ==========================================
// DELETE ATTENDANCE
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    attendanceController.deleteAttendance
);


module.exports = router;
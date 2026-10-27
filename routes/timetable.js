const express = require("express");
const router = express.Router();

const timetableController =
    require("../controllers/timetableController");

const { auth, authorize } =
    require("../middleware/auth");


// ======================================================
// GET ALL TIMETABLE ENTRIES
// ADMIN + TEACHER
// ======================================================

router.get(
    "/",
    auth,
    authorize("admin", "teacher"),
    timetableController.getAllTimetable
);


// ======================================================
// GET TIMETABLE FOR A CLASS
// AUTHENTICATED USERS
// ======================================================

router.get(
    "/class/:classId",
    auth,
    authorize(
        "admin",
        "teacher",
        "parent",
        "student"
    ),
    timetableController.getClassTimetable
);


// ======================================================
// GET TIMETABLE FOR A TEACHER
// ADMIN + TEACHER
// ======================================================

router.get(
    "/teacher/:teacherId",
    auth,
    authorize("admin", "teacher"),
    timetableController.getTeacherTimetable
);


// ======================================================
// GET TIMETABLE ENTRY BY ID
// AUTHENTICATED USERS
// ======================================================

router.get(
    "/:id",
    auth,
    authorize(
        "admin",
        "teacher",
        "parent",
        "student"
    ),
    timetableController.getTimetableById
);


// ======================================================
// CREATE TIMETABLE ENTRY
// ADMIN ONLY
// ======================================================

router.post(
    "/",
    auth,
    authorize("admin"),
    timetableController.createTimetable
);


// ======================================================
// UPDATE TIMETABLE ENTRY
// ADMIN ONLY
// ======================================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    timetableController.updateTimetable
);


// ======================================================
// DELETE TIMETABLE ENTRY
// ADMIN ONLY
// ======================================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    timetableController.deleteTimetable
);


module.exports = router;
const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");
const { auth, authorize } = require("../middleware/auth");


// ==========================================
// GET ALL CLASSES
// ==========================================

router.get(
    "/",
    auth,
    classController.getAllClasses
);


// ==========================================
// GET ONE CLASS
// ==========================================

router.get(
    "/:id",
    auth,
    classController.getClassById
);


// ==========================================
// CREATE CLASS
// ADMIN ONLY
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin"),
    classController.createClass
);


// ==========================================
// UPDATE CLASS
// ADMIN ONLY
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    classController.updateClass
);


// ==========================================
// ASSIGN TEACHER TO CLASS
// ADMIN ONLY
// ==========================================

router.post(
    "/:id/teacher",
    auth,
    authorize("admin"),
    classController.assignTeacher
);


// ==========================================
// REMOVE TEACHER FROM CLASS
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id/teacher",
    auth,
    authorize("admin"),
    classController.removeTeacher
);


// ==========================================
// DELETE CLASS
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    classController.deleteClass
);


module.exports = router;
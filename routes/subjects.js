const express = require("express");

const router = express.Router();

const subjectController = require("../controllers/subjectController");

const { auth, authorize } = require("../middleware/auth");


// GET ALL SUBJECTS
router.get(
    "/",
    auth,
    authorize("admin", "teacher"),
    subjectController.getAllSubjects
);


// GET ONE SUBJECT
router.get(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    subjectController.getSubjectById
);


// CREATE SUBJECT
router.post(
    "/",
    auth,
    authorize("admin"),
    subjectController.createSubject
);


// UPDATE SUBJECT
router.put(
    "/:id",
    auth,
    authorize("admin"),
    subjectController.updateSubject
);


// DELETE SUBJECT
router.delete(
    "/:id",
    auth,
    authorize("admin"),
    subjectController.deleteSubject
);


module.exports = router;
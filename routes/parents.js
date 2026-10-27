const express = require("express");
const router = express.Router();

const parentController = require("../controllers/parentController");
const { auth, authorize } = require("../middleware/auth");


// ======================================================
// GET ALL PARENTS
// ADMIN ONLY
// ======================================================

router.get(
    "/",
    auth,
    authorize("admin"),
    parentController.getAllParents
);


// ======================================================
// GET MY CHILDREN
// PARENT ONLY
//
// The parent's ID comes from the JWT.
// A parent cannot choose another parent's ID.
// ======================================================

router.get(
    "/my-children",
    auth,
    authorize("parent"),
    parentController.getMyChildren
);


// ======================================================
// GET PARENT BY USER ID
// ADMIN + PARENT
// ======================================================

router.get(
    "/user/:userId",
    auth,
    authorize("admin", "parent"),
    parentController.getParentByUserId
);


// ======================================================
// GET PARENTS FOR A STUDENT
// ADMIN + TEACHER
// ======================================================

router.get(
    "/student/:studentId",
    auth,
    authorize("admin", "teacher"),
    parentController.getStudentParents
);


// ======================================================
// GET STUDENTS FOR A PARENT
// ADMIN + PARENT
// ======================================================

router.get(
    "/:parentId/students",
    auth,
    authorize("admin", "parent"),
    parentController.getParentStudents
);


// ======================================================
// GET PARENT BY ID
// ADMIN + PARENT
// ======================================================

router.get(
    "/:id",
    auth,
    authorize("admin", "parent"),
    parentController.getParentById
);


// ======================================================
// CREATE PARENT PROFILE
// ADMIN ONLY
// ======================================================

router.post(
    "/",
    auth,
    authorize("admin"),
    parentController.createParent
);


// ======================================================
// UPDATE PARENT PROFILE
// ADMIN ONLY
// ======================================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    parentController.updateParent
);


// ======================================================
// DELETE PARENT PROFILE
// ADMIN ONLY
// ======================================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    parentController.deleteParent
);


module.exports = router;
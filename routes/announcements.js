const express = require("express");
const router = express.Router();

const announcementController = require("../controllers/announcementController");
const { auth, authorize } = require("../middleware/auth");

// ======================================================
// GET PUBLISHED ANNOUNCEMENTS
// ALL AUTHENTICATED USERS
// ======================================================

router.get(
    "/published",
    auth,
    authorize("admin", "teacher", "parent", "student"),
    announcementController.getPublishedAnnouncements
);


// ======================================================
// GET ALL ANNOUNCEMENTS
// ADMIN + TEACHER
// ======================================================

router.get(
    "/",
    auth,
    authorize("admin", "teacher"),
    announcementController.getAllAnnouncements
);


// ======================================================
// GET ANNOUNCEMENT BY ID
// ADMIN + TEACHER
// ======================================================

router.get(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    announcementController.getAnnouncementById
);


// ======================================================
// CREATE ANNOUNCEMENT
// ADMIN + TEACHER
// ======================================================

router.post(
    "/",
    auth,
    authorize("admin", "teacher"),
    announcementController.createAnnouncement
);


// ======================================================
// UPDATE ANNOUNCEMENT
// ADMIN + TEACHER
// ======================================================

router.put(
    "/:id",
    auth,
    authorize("admin", "teacher"),
    announcementController.updateAnnouncement
);


// ======================================================
// PUBLISH ANNOUNCEMENT
// ADMIN + TEACHER
// ======================================================

router.patch(
    "/:id/publish",
    auth,
    authorize("admin", "teacher"),
    announcementController.publishAnnouncement
);


// ======================================================
// ARCHIVE ANNOUNCEMENT
// ADMIN + TEACHER
// ======================================================

router.patch(
    "/:id/archive",
    auth,
    authorize("admin", "teacher"),
    announcementController.archiveAnnouncement
);


// ======================================================
// DELETE ANNOUNCEMENT
// ADMIN ONLY
// ======================================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    announcementController.deleteAnnouncement
);


module.exports = router;
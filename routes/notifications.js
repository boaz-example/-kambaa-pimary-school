const express = require("express");
const router = express.Router();

const notificationController =
    require("../controllers/notificationController");

const { auth, authorize } =
    require("../middleware/auth");


// ======================================================
// GET MY NOTIFICATIONS
// ALL AUTHENTICATED USERS
// ======================================================

router.get(
    "/",
    auth,
    authorize(
        "admin",
        "teacher",
        "parent",
        "student"
    ),
    notificationController.getMyNotifications
);


// ======================================================
// GET MY UNREAD NOTIFICATIONS
// ALL AUTHENTICATED USERS
// ======================================================

router.get(
    "/unread",
    auth,
    authorize(
        "admin",
        "teacher",
        "parent",
        "student"
    ),
    notificationController.getUnreadNotifications
);


// ======================================================
// GET NOTIFICATION BY ID
// ALL AUTHENTICATED USERS
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
    notificationController.getNotificationById
);


// ======================================================
// CREATE NOTIFICATION
// ADMIN ONLY
// ======================================================

router.post(
    "/",
    auth,
    authorize("admin"),
    notificationController.createNotification
);


// ======================================================
// MARK ONE AS READ
// ALL AUTHENTICATED USERS
// ======================================================

router.patch(
    "/:id/read",
    auth,
    authorize(
        "admin",
        "teacher",
        "parent",
        "student"
    ),
    notificationController.markAsRead
);


// ======================================================
// MARK ALL AS READ
// ALL AUTHENTICATED USERS
// ======================================================

router.patch(
    "/read-all",
    auth,
    authorize(
        "admin",
        "teacher",
        "parent",
        "student"
    ),
    notificationController.markAllAsRead
);


// ======================================================
// DELETE MY NOTIFICATION
// ALL AUTHENTICATED USERS
// ======================================================

router.delete(
    "/:id",
    auth,
    authorize(
        "admin",
        "teacher",
        "parent",
        "student"
    ),
    notificationController.deleteNotification
);


module.exports = router;
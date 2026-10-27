const express = require("express");
const router = express.Router();

const schoolSettingsController =
    require("../controllers/schoolSettingsController");

const { auth, authorize } =
    require("../middleware/auth");


// ======================================================
// GET SCHOOL SETTINGS
// AUTHENTICATED USERS
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
    schoolSettingsController.getSettings
);


// ======================================================
// GET SETTINGS BY ID
// ADMIN ONLY
// ======================================================

router.get(
    "/:id",
    auth,
    authorize("admin"),
    schoolSettingsController.getSettingsById
);


// ======================================================
// CREATE SCHOOL SETTINGS
// ADMIN ONLY
// ======================================================

router.post(
    "/",
    auth,
    authorize("admin"),
    schoolSettingsController.createSettings
);


// ======================================================
// UPDATE SCHOOL SETTINGS
// ADMIN ONLY
// ======================================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    schoolSettingsController.updateSettings
);


// ======================================================
// DELETE SCHOOL SETTINGS
// ADMIN ONLY
// ======================================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    schoolSettingsController.deleteSettings
);


module.exports = router;

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { auth, authorize } = require("../middleware/auth");

// Check that the controller functions exist
const {
    login,
    register,
    checkFirstTime,
    setFirstPassword,
    profile
} = authController;

if (typeof login !== "function") {
    throw new Error("authController.login is missing or not a function");
}

if (typeof register !== "function") {
    throw new Error("authController.register is missing or not a function");
}

if (typeof checkFirstTime !== "function") {
    throw new Error("authController.checkFirstTime is missing or not a function");
}

if (typeof setFirstPassword !== "function") {
    throw new Error("authController.setFirstPassword is missing or not a function");
}

if (typeof profile !== "function") {
    throw new Error("authController.profile is missing or not a function");
}

if (typeof auth !== "function") {
    throw new Error("auth middleware is missing or not a function");
}

if (typeof authorize !== "function") {
    throw new Error("authorize middleware is missing or not a function");
}

// POST: Login
router.post("/login", login);

// POST: Parent registration
router.post("/register", register);

// POST: Check first-time account
router.post("/check-first-time", checkFirstTime);

// POST: Set first-time password
router.post("/set-first-password", setFirstPassword);

// GET: Protected profile
router.get("/profile", auth, profile);

// GET: Admin-only route
router.get("/admin", auth, authorize("admin"), (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Admin access granted.",
        user: req.user
    });
});

module.exports = router;

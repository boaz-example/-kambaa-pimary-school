const express = require("express");
const router = express.Router();

const feeController = require("../controllers/feeController");
const { auth, authorize } = require("../middleware/auth");

// ==========================================
// GET ALL FEES
// ADMIN ONLY
// ==========================================

router.get(
    "/",
    auth,
    authorize("admin"),
    feeController.getAllFees
);

// ==========================================
// GET FEE BY ID
// ADMIN ONLY
// ==========================================

router.get(
    "/:id",
    auth,
    authorize("admin"),
    feeController.getFeeById
);

// ==========================================
// GET STUDENT FEES
// ADMIN ONLY
// ==========================================

router.get(
    "/student/:studentId",
    auth,
    authorize("admin"),
    feeController.getStudentFees
);

// ==========================================
// CREATE FEE
// ADMIN ONLY
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin"),
    feeController.createFee
);

// ==========================================
// UPDATE FEE
// ADMIN ONLY
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    feeController.updateFee
);

// ==========================================
// DELETE FEE
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    feeController.deleteFee
);

module.exports = router;
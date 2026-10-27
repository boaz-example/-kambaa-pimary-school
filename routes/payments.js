const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const { auth, authorize } = require("../middleware/auth");

// ==========================================
// GET ALL PAYMENTS
// ADMIN ONLY
// ==========================================

router.get(
    "/",
    auth,
    authorize("admin"),
    paymentController.getAllPayments
);

// ==========================================
// GET PAYMENT BY ID
// ADMIN ONLY
// ==========================================

router.get(
    "/:id",
    auth,
    authorize("admin"),
    paymentController.getPaymentById
);

// ==========================================
// GET STUDENT PAYMENTS
// ADMIN ONLY
// ==========================================

router.get(
    "/student/:studentId",
    auth,
    authorize("admin"),
    paymentController.getStudentPayments
);

// ==========================================
// GET PAYMENTS FOR FEE
// ADMIN ONLY
// ==========================================

router.get(
    "/fee/:feeId",
    auth,
    authorize("admin"),
    paymentController.getFeePayments
);

// ==========================================
// CREATE PAYMENT
// ADMIN ONLY
// ==========================================

router.post(
    "/",
    auth,
    authorize("admin"),
    paymentController.createPayment
);

// ==========================================
// UPDATE PAYMENT
// ADMIN ONLY
// ==========================================

router.put(
    "/:id",
    auth,
    authorize("admin"),
    paymentController.updatePayment
);

// ==========================================
// DELETE PAYMENT
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    auth,
    authorize("admin"),
    paymentController.deletePayment
);

module.exports = router;
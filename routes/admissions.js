const express = require("express");

const router = express.Router();

const admissionController =
    require("../controllers/admissionController");


// Public admission submission
router.post(
    "/",
    admissionController.createAdmission
);


// Get admissions
router.get(
    "/",
    admissionController.getAdmissions
);


// Get one admission
router.get(
    "/:id",
    admissionController.getAdmissionById
);


// Review admission
router.patch(
    "/:id",
    admissionController.reviewAdmission
);


module.exports = router;
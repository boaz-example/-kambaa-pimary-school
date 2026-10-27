const Admission = require("../models/admissionModel");


// ==========================================
// GET ADMISSIONS
// ==========================================

exports.getAdmissions = async (req, res) => {

    try {

        const status = req.query.status || null;

        const admissions =
            await Admission.getAll(status);

        res.json(admissions);

    } catch (error) {

        console.error(
            "GET ADMISSIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// GET ONE ADMISSION
// ==========================================

exports.getAdmissionById = async (req, res) => {

    try {

        const admission =
            await Admission.getById(req.params.id);

        if (!admission) {

            return res.status(404).json({
                success: false,
                message: "Admission not found."
            });
        }

        res.json(admission);

    } catch (error) {

        console.error(
            "GET ADMISSION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// SUBMIT ADMISSION
// PUBLIC
// ==========================================

exports.createAdmission = async (req, res) => {

    try {

        const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    class_id,
    requested_class_id,
    parent_name,
    parent_phone,
    parent_email
} = req.body;

const requestedClassId =
    requested_class_id || class_id || null;


        if (
            !first_name ||
            !last_name ||
            !parent_name ||
            !parent_phone
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "First name, last name, parent name and parent phone are required."
            });
        }


        const id =
            await Admission.create({
                first_name,
                last_name,
                date_of_birth,
                gender,
                requested_class_id: requestedClassId,
                parent_name,
                parent_phone,
                parent_email
            });


        const admission =
            await Admission.getById(id);


        res.status(201).json({
            success: true,
            message:
                "Admission application submitted successfully.",
            admission
        });

    } catch (error) {

        console.error(
            "CREATE ADMISSION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// REVIEW ADMISSION
// ADMIN ONLY
// ==========================================

exports.reviewAdmission = async (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "accepted",
            "rejected"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message:
                    "Status must be accepted or rejected."
            });
        }


        const existing =
            await Admission.getById(req.params.id);


        if (!existing) {

            return res.status(404).json({
                success: false,
                message: "Admission not found."
            });
        }


        await Admission.updateStatus(
            req.params.id,
            status,
            req.user.id
        );


        res.json({
            success: true,
            message:
                `Application ${status} successfully.`
        });

    } catch (error) {

        console.error(
            "REVIEW ADMISSION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
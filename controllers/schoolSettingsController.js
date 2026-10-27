const SchoolSettings = require("../models/schoolSettingsModel");

// ======================================================
// GET SCHOOL SETTINGS
// ======================================================

exports.getSettings = async (req, res) => {
    try {
        const settings = await SchoolSettings.get();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "School settings have not been configured yet."
            });
        }

        res.json({
            success: true,
            settings
        });

    } catch (error) {
        console.error("Get school settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve school settings."
        });
    }
};


// ======================================================
// GET SETTINGS BY ID
// ADMIN ONLY
// ======================================================

exports.getSettingsById = async (req, res) => {
    try {
        const settings =
            await SchoolSettings.getById(req.params.id);

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "School settings not found."
            });
        }

        res.json({
            success: true,
            settings
        });

    } catch (error) {
        console.error(
            "Get school settings by ID error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve school settings."
        });
    }
};


// ======================================================
// CREATE SCHOOL SETTINGS
// ADMIN ONLY
// ======================================================

exports.createSettings = async (req, res) => {
    try {
        const {
            school_name,
            school_code,
            address,
            phone,
            email,
            website,
            motto,
            logo,
            current_academic_year,
            current_term
        } = req.body;

        if (!school_name) {
            return res.status(400).json({
                success: false,
                message: "School name is required."
            });
        }

        // Only one settings record is intended.
        const existing = await SchoolSettings.get();

        if (existing) {
            return res.status(409).json({
                success: false,
                message:
                    "School settings already exist. Use update instead."
            });
        }

        const allowedTerms = [
            "Term 1",
            "Term 2",
            "Term 3"
        ];

        if (
            current_term &&
            !allowedTerms.includes(current_term)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid academic term."
            });
        }

        const settingsId =
            await SchoolSettings.create({
                school_name,
                school_code,
                address,
                phone,
                email,
                website,
                motto,
                logo,
                current_academic_year,
                current_term
            });

        const settings =
            await SchoolSettings.getById(settingsId);

        res.status(201).json({
            success: true,
            message:
                "School settings created successfully.",
            settings
        });

    } catch (error) {
        console.error(
            "Create school settings error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to create school settings."
        });
    }
};


// ======================================================
// UPDATE SCHOOL SETTINGS
// ADMIN ONLY
// ======================================================

exports.updateSettings = async (req, res) => {
    try {
        const { id } = req.params;

        const existing =
            await SchoolSettings.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "School settings not found."
            });
        }

        const {
            school_name,
            school_code,
            address,
            phone,
            email,
            website,
            motto,
            logo,
            current_academic_year,
            current_term
        } = req.body;

        if (!school_name) {
            return res.status(400).json({
                success: false,
                message: "School name is required."
            });
        }

        const allowedTerms = [
            "Term 1",
            "Term 2",
            "Term 3"
        ];

        if (
            current_term &&
            !allowedTerms.includes(current_term)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid academic term."
            });
        }

        await SchoolSettings.update(id, {
            school_name,
            school_code,
            address,
            phone,
            email,
            website,
            motto,
            logo,
            current_academic_year,
            current_term
        });

        const settings =
            await SchoolSettings.getById(id);

        res.json({
            success: true,
            message:
                "School settings updated successfully.",
            settings
        });

    } catch (error) {
        console.error(
            "Update school settings error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update school settings."
        });
    }
};


// ======================================================
// DELETE SCHOOL SETTINGS
// ADMIN ONLY
// ======================================================

exports.deleteSettings = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows =
            await SchoolSettings.delete(id);

        if (!affectedRows) {
            return res.status(404).json({
                success: false,
                message: "School settings not found."
            });
        }

        res.json({
            success: true,
            message:
                "School settings deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete school settings error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete school settings."
        });
    }
};
const Subject = require("../models/subjectModel");

// GET ALL SUBJECTS
exports.getAllSubjects = async (req, res) => {
    try {

        const subjects = await Subject.getAll();

        res.json({
            success: true,
            count: subjects.length,
            subjects
        });

    } catch (error) {

        console.error("GET SUBJECTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SUBJECT BY ID
exports.getSubjectById = async (req, res) => {
    try {

        const subject = await Subject.getById(req.params.id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found."
            });
        }

        res.json({
            success: true,
            subject
        });

    } catch (error) {

        console.error("GET SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// CREATE SUBJECT
exports.createSubject = async (req, res) => {
    try {

        const { subject_name } = req.body;

        if (!subject_name || !subject_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subject name is required."
            });
        }

        const id = await Subject.create(subject_name.trim());

        res.status(201).json({
            success: true,
            message: "Subject created successfully.",
            id
        });

    } catch (error) {

        console.error("CREATE SUBJECT ERROR:", error);

        // Duplicate subject
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Subject already exists."
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE SUBJECT
exports.updateSubject = async (req, res) => {
    try {

        const { subject_name } = req.body;

        if (!subject_name || !subject_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subject name is required."
            });
        }

        const updated = await Subject.update(
            req.params.id,
            subject_name.trim()
        );

        if (updated === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found."
            });
        }

        res.json({
            success: true,
            message: "Subject updated successfully."
        });

    } catch (error) {

        console.error("UPDATE SUBJECT ERROR:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Subject already exists."
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE SUBJECT
exports.deleteSubject = async (req, res) => {
    try {

        const deleted = await Subject.delete(req.params.id);

        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found."
            });
        }

        res.json({
            success: true,
            message: "Subject deleted successfully."
        });

    } catch (error) {

        console.error("DELETE SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
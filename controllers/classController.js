const ClassModel = require("../models/classModel");


// ==========================================
// GET ALL CLASSES
// ==========================================

exports.getAllClasses = async (req, res) => {
    try {

        const classes = await ClassModel.getAll();

        res.json({
            success: true,
            count: classes.length,
            classes
        });

    } catch (error) {

        console.error("GET CLASSES ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// GET ONE CLASS
// ==========================================

exports.getClassById = async (req, res) => {
    try {

        const classData = await ClassModel.getById(req.params.id);

        if (!classData) {

            return res.status(404).json({
                success: false,
                message: "Class not found."
            });
        }

        res.json({
            success: true,
            class: classData
        });

    } catch (error) {

        console.error("GET CLASS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// CREATE CLASS
// ADMIN ONLY
// ==========================================

exports.createClass = async (req, res) => {
    try {

        const {
            class_name,
            class_teacher_id
        } = req.body;


        if (!class_name) {

            return res.status(400).json({
                success: false,
                message: "class_name is required."
            });
        }


        const id = await ClassModel.create({
            class_name,
            class_teacher_id
        });


        res.status(201).json({
            success: true,
            message: "Class created successfully.",
            id
        });

    } catch (error) {

        console.error("CREATE CLASS ERROR:", error);


        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({
                success: false,
                message: "Class already exists."
            });
        }


        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// UPDATE CLASS
// ADMIN ONLY
// ==========================================

exports.updateClass = async (req, res) => {
    try {

        const {
            class_name,
            class_teacher_id
        } = req.body;


        if (!class_name) {

            return res.status(400).json({
                success: false,
                message: "class_name is required."
            });
        }


        const updated = await ClassModel.update(
            req.params.id,
            {
                class_name,
                class_teacher_id
            }
        );


        if (updated === 0) {

            return res.status(404).json({
                success: false,
                message: "Class not found."
            });
        }


        res.json({
            success: true,
            message: "Class updated successfully."
        });

    } catch (error) {

        console.error("UPDATE CLASS ERROR:", error);


        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// ASSIGN TEACHER
// ADMIN ONLY
// ==========================================

exports.assignTeacher = async (req, res) => {
    try {

        const classId = req.params.id;
        const { teacher_id } = req.body;


        if (!teacher_id) {

            return res.status(400).json({
                success: false,
                message: "teacher_id is required."
            });
        }


        const result = await ClassModel.assignTeacher(
            classId,
            teacher_id
        );


        // Teacher doesn't exist
        if (
            !result.success &&
            result.reason === "TEACHER_NOT_FOUND"
        ) {

            return res.status(404).json({
                success: false,
                message: "Active teacher not found."
            });
        }


        // Class doesn't exist
        if (
            !result.success &&
            result.reason === "CLASS_NOT_FOUND"
        ) {

            return res.status(404).json({
                success: false,
                message: "Class not found."
            });
        }


        res.json({
            success: true,
            message: "Teacher assigned to class successfully."
        });

    } catch (error) {

        console.error("ASSIGN TEACHER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// REMOVE TEACHER
// ADMIN ONLY
// ==========================================

exports.removeTeacher = async (req, res) => {
    try {

        const removed = await ClassModel.removeTeacher(
            req.params.id
        );


        if (removed === 0) {

            return res.status(404).json({
                success: false,
                message: "Class not found."
            });
        }


        res.json({
            success: true,
            message: "Teacher removed from class successfully."
        });

    } catch (error) {

        console.error("REMOVE TEACHER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// DELETE CLASS
// ADMIN ONLY
// ==========================================

exports.deleteClass = async (req, res) => {
    try {

        const deleted = await ClassModel.delete(
            req.params.id
        );


        if (deleted === 0) {

            return res.status(404).json({
                success: false,
                message: "Class not found."
            });
        }


        res.json({
            success: true,
            message: "Class deleted successfully."
        });

    } catch (error) {

        console.error("DELETE CLASS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
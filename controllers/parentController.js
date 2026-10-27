const Parent = require("../models/parentModel");
const ParentStudent = require("../models/parentStudentModel");


// ==========================================
// GET ALL PARENTS
// ==========================================

exports.getAllParents = async (req, res) => {
    try {

        const parents = await Parent.getAll();

        res.json({
            success: true,
            count: parents.length,
            parents
        });

    } catch (error) {

        console.error("Get parents error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve parents."
        });
    }
};


// ==========================================
// GET PARENT BY ID
// ==========================================

exports.getParentById = async (req, res) => {
    try {

        const parent = await Parent.getById(req.params.id);

        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent not found."
            });
        }

        res.json({
            success: true,
            parent
        });

    } catch (error) {

        console.error("Get parent error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve parent."
        });
    }
};


// ==========================================
// GET PARENT BY USER ID
// ==========================================

exports.getParentByUserId = async (req, res) => {
    try {

        const parent =
            await Parent.getByUserId(req.params.userId);

        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent profile not found."
            });
        }

        res.json({
            success: true,
            parent
        });

    } catch (error) {

        console.error("Get parent user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve parent."
        });
    }
};


// ==========================================
// CREATE PARENT PROFILE
// ADMIN ONLY
// ==========================================

exports.createParent = async (req, res) => {
    try {

        const {
            user_id,
            occupation,
            address,
            relationship
        } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        const existing =
            await Parent.getByUserId(user_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message:
                    "A parent profile already exists for this user."
            });
        }

        const parentId = await Parent.create({
            user_id,
            occupation,
            address,
            relationship
        });

        const parent =
            await Parent.getById(parentId);

        res.status(201).json({
            success: true,
            message:
                "Parent profile created successfully.",
            parent
        });

    } catch (error) {

        console.error("Create parent error:", error);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                success: false,
                message: "The specified user does not exist."
            });
        }

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "A parent profile already exists for this user."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create parent profile."
        });
    }
};


// ==========================================
// UPDATE PARENT PROFILE
// ADMIN ONLY
// ==========================================

exports.updateParent = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Parent.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Parent not found."
            });
        }

        const {
            occupation,
            address,
            relationship
        } = req.body;

        await Parent.update(id, {
            occupation,
            address,
            relationship
        });

        const parent =
            await Parent.getById(id);

        res.json({
            success: true,
            message:
                "Parent profile updated successfully.",
            parent
        });

    } catch (error) {

        console.error("Update parent error:", error);

        res.status(500).json({
            success: false,
            message:
                "Failed to update parent profile."
        });
    }
};


// ==========================================
// DELETE PARENT PROFILE
// ADMIN ONLY
// ==========================================

exports.deleteParent = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Parent.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Parent not found."
            });
        }

        await Parent.delete(id);

        res.json({
            success: true,
            message:
                "Parent profile deleted successfully."
        });

    } catch (error) {

        console.error("Delete parent error:", error);

        res.status(500).json({
            success: false,
            message:
                "Failed to delete parent profile."
        });
    }
};


// ==========================================
// GET STUDENTS FOR PARENT
// ==========================================

exports.getParentStudents = async (req, res) => {
    try {

        const students =
            await ParentStudent.getStudentsByParent(
                req.params.parentId
            );

        res.json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {

        console.error(
            "Get parent students error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve parent's students."
        });
    }
};


// ==========================================
// GET PARENTS FOR STUDENT
// ==========================================

exports.getStudentParents = async (req, res) => {
    try {

        const parents =
            await ParentStudent.getParentsByStudent(
                req.params.studentId
            );

        res.json({
            success: true,
            count: parents.length,
            parents
        });

    } catch (error) {

        console.error(
            "Get student parents error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve student's parents."
        });
    }
};


// ==========================================
// LINK PARENT TO STUDENT
// ADMIN ONLY
// ==========================================

exports.linkParentStudent = async (req, res) => {
    try {

        const {
            parent_id,
            student_id,
            relationship,
            is_primary
        } = req.body;

        if (!parent_id || !student_id) {
            return res.status(400).json({
                success: false,
                message:
                    "Parent ID and student ID are required."
            });
        }

        const linkId =
            await ParentStudent.create({
                parent_id,
                student_id,
                relationship,
                is_primary
            });

        res.status(201).json({
            success: true,
            message:
                "Parent linked to student successfully.",
            link_id: linkId
        });

    } catch (error) {

        console.error(
            "Link parent student error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "This parent is already linked to this student."
            });
        }

        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Parent or student does not exist."
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to link parent to student."
        });
    }
};


// ==========================================
// UPDATE PARENT-STUDENT LINK
// ADMIN ONLY
// ==========================================

exports.getParentStudents = async (req, res) => {
    try {

        // Admin can request any parent's students.
        // Parent can only access their own students.
        let parentId;

        if (req.user.role === "admin") {
            parentId = req.params.parentId;
        } else {
            parentId = req.user.id;
        }

        const students =
            await ParentStudent.getStudentsByParent(parentId);

        res.json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {

        console.error(
            "Get parent students error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve parent's students."
        });
    }
};
// ==========================================
// GET MY CHILDREN
// LOGGED-IN PARENT ONLY
// ==========================================

exports.getMyChildren = async (req, res) => {
    try {

        const parentId = req.user.id;

        const students =
            await ParentStudent.getStudentsByParent(parentId);

        return res.json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {

        console.error(
            "Get my children error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to retrieve your children."
        });
    }
};
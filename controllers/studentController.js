const Student = require("../models/studentModel");

// ==========================================
// GET ALL STUDENTS
// ==========================================

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.getAll();

        res.json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {
        console.error("Get students error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve students."
        });
    }
};


// ==========================================
// GET ONE STUDENT
// ==========================================

exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.getById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        res.json({
            success: true,
            student
        });

    } catch (error) {
        console.error("Get student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve student."
        });
    }
};


// ==========================================
// CREATE STUDENT
// ADMIN ONLY
// ==========================================

exports.createStudent = async (req, res) => {
    try {

        const {
            admission_number,
            first_name,
            last_name,
            gender,
            dob,
            class_id
        } = req.body;


        // Required fields

        if (
            !admission_number ||
            !first_name ||
            !last_name ||
            !gender
        ) {
            return res.status(400).json({
                success: false,
                message: "Admission number, first name, last name and gender are required."
            });
        }


        // Validate gender

        if (!["Male", "Female"].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: "Gender must be Male or Female."
            });
        }


        const result = await Student.create({
            admission_number,
            first_name,
            last_name,
            gender,
            dob,
            class_id
        });


        if (!result.success) {

            if (result.reason === "CLASS_NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message: "The specified class does not exist."
                });
            }
        }


        const student = await Student.getById(result.id);


        res.status(201).json({
            success: true,
            message: "Student created successfully.",
            student
        });

    } catch (error) {

        console.error("Create student error:", error);

        // Duplicate admission number

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Admission number already exists."
            });
        }


        res.status(500).json({
            success: false,
            message: "Failed to create student."
        });
    }
};


// ==========================================
// UPDATE STUDENT
// ADMIN ONLY
// ==========================================

exports.updateStudent = async (req, res) => {
    try {

        const { id } = req.params;

        const existingStudent = await Student.getById(id);

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }


        const {
            admission_number,
            first_name,
            last_name,
            gender,
            dob,
            class_id
        } = req.body;


        if (
            !admission_number ||
            !first_name ||
            !last_name ||
            !gender
        ) {
            return res.status(400).json({
                success: false,
                message: "Admission number, first name, last name and gender are required."
            });
        }


        if (!["Male", "Female"].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: "Gender must be Male or Female."
            });
        }


        const result = await Student.update(id, {
            admission_number,
            first_name,
            last_name,
            gender,
            dob,
            class_id
        });


        if (!result.success) {

            if (result.reason === "CLASS_NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message: "The specified class does not exist."
                });
            }
        }


        const student = await Student.getById(id);


        res.json({
            success: true,
            message: "Student updated successfully.",
            student
        });

    } catch (error) {

        console.error("Update student error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Admission number already exists."
            });
        }


        res.status(500).json({
            success: false,
            message: "Failed to update student."
        });
    }
};


// ==========================================
// ASSIGN STUDENT TO CLASS
// ADMIN ONLY
// ==========================================

exports.assignStudentToClass = async (req, res) => {
    try {

        const { id } = req.params;
        const { class_id } = req.body;


        if (!class_id) {
            return res.status(400).json({
                success: false,
                message: "class_id is required."
            });
        }


        const result = await Student.assignClass(id, class_id);


        if (!result.success) {

            if (result.reason === "STUDENT_NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message: "Student not found."
                });
            }


            if (result.reason === "CLASS_NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message: "Class not found."
                });
            }
        }


        const student = await Student.getById(id);


        res.json({
            success: true,
            message: "Student assigned to class successfully.",
            student
        });

    } catch (error) {

        console.error("Assign class error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to assign student to class."
        });
    }
};


// ==========================================
// REMOVE STUDENT FROM CLASS
// ADMIN ONLY
// ==========================================

exports.removeStudentFromClass = async (req, res) => {
    try {

        const { id } = req.params;

        const student = await Student.getById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }


        await Student.removeFromClass(id);


        const updatedStudent = await Student.getById(id);


        res.json({
            success: true,
            message: "Student removed from class successfully.",
            student: updatedStudent
        });

    } catch (error) {

        console.error("Remove class error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to remove student from class."
        });
    }
};


// ==========================================
// UPDATE STUDENT STATUS
// ADMIN ONLY
// ==========================================

exports.updateStudentStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;


        const allowedStatuses = [
            "Active",
            "Transferred",
            "Completed"
        ];


        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student status."
            });
        }


        const student = await Student.getById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }


        await Student.updateStatus(id, status);


        const updatedStudent = await Student.getById(id);


        res.json({
            success: true,
            message: "Student status updated successfully.",
            student: updatedStudent
        });

    } catch (error) {

        console.error("Update status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update student status."
        });
    }
};


// ==========================================
// DELETE STUDENT
// ADMIN ONLY
// ==========================================

exports.deleteStudent = async (req, res) => {
    try {

        const { id } = req.params;

        const student = await Student.getById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }


        await Student.delete(id);


        res.json({
            success: true,
            message: "Student deleted successfully."
        });

    } catch (error) {

        console.error("Delete student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete student."
        });
    }
};
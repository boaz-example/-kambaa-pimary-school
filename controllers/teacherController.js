const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherModel");

// ==========================================
// GET ALL TEACHERS
// ==========================================

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.getAll();

        res.json({
            success: true,
            count: teachers.length,
            teachers
        });

    } catch (error) {
        console.error("GET TEACHERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// GET TEACHER BY ID
// ==========================================

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.getById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found."
            });
        }

        res.json({
            success: true,
            teacher
        });

    } catch (error) {
        console.error("GET TEACHER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// CREATE TEACHER ACCOUNT + PROFILE
// ADMIN ONLY
// ==========================================

exports.createTeacher = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phone,
            employee_number,
            qualification,
            specialization,
            hire_date
        } = req.body;


        // Check required fields
        if (!name || !email || !password || !employee_number) {
            return res.status(400).json({
                success: false,
                message:
                    "name, email, password and employee_number are required."
            });
        }


        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user + teacher profile
        const result = await Teacher.create({
            name,
            email,
            password: hashedPassword,
            phone,
            employee_number,
            qualification,
            specialization,
            hire_date
        });


        res.status(201).json({
            success: true,
            message: "Teacher account created successfully.",

            teacher: {
                id: result.teacherId,
                user_id: result.userId,
                name,
                email,
                role: "teacher",
                employee_number,
                qualification: qualification || null,
                specialization: specialization || null,
                hire_date: hire_date || null
            }
        });


    } catch (error) {

        console.error("CREATE TEACHER ERROR:", error);


        // Duplicate email or employee number
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Email or employee number already exists."
            });
        }


        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// UPDATE TEACHER
// ADMIN ONLY
// ==========================================

exports.updateTeacher = async (req, res) => {
    try {

        const {
            employee_number,
            qualification,
            specialization,
            hire_date
        } = req.body;


        if (!employee_number) {
            return res.status(400).json({
                success: false,
                message: "employee_number is required."
            });
        }


        const updated = await Teacher.update(
            req.params.id,
            {
                employee_number,
                qualification,
                specialization,
                hire_date
            }
        );


        if (updated === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found."
            });
        }


        res.json({
            success: true,
            message: "Teacher updated successfully."
        });


    } catch (error) {

        console.error("UPDATE TEACHER ERROR:", error);


        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Employee number already exists."
            });
        }


        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// DELETE TEACHER
// ADMIN ONLY
// ==========================================

exports.deleteTeacher = async (req, res) => {
    try {

        const deleted = await Teacher.delete(req.params.id);


        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found."
            });
        }


        res.json({
            success: true,
            message: "Teacher and associated account deleted successfully."
        });


    } catch (error) {

        console.error("DELETE TEACHER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const Attendance = require("../models/attendanceModel");


// ==========================================
// GET ALL ATTENDANCE
// ==========================================

exports.getAllAttendance = async (req, res) => {
    try {

        const attendance = await Attendance.getAll();

        res.json({
            success: true,
            count: attendance.length,
            attendance
        });

    } catch (error) {

        console.error("Get attendance error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance."
        });
    }
};


// ==========================================
// GET ATTENDANCE BY ID
// ==========================================

exports.getAttendanceById = async (req, res) => {
    try {

        const { id } = req.params;

        const attendance = await Attendance.getById(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found."
            });
        }

        res.json({
            success: true,
            attendance
        });

    } catch (error) {

        console.error("Get attendance record error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance record."
        });
    }
};


// ==========================================
// GET STUDENT ATTENDANCE
// ==========================================

exports.getStudentAttendance = async (req, res) => {
    try {

        const { studentId } = req.params;

        const attendance =
            await Attendance.getByStudent(studentId);

        res.json({
            success: true,
            count: attendance.length,
            attendance
        });

    } catch (error) {

        console.error("Get student attendance error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve student attendance."
        });
    }
};


// ==========================================
// GET ATTENDANCE BY DATE
// ==========================================

exports.getAttendanceByDate = async (req, res) => {
    try {

        const { date } = req.params;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Date must use YYYY-MM-DD format."
            });
        }

        const attendance =
            await Attendance.getByDate(date);

        res.json({
            success: true,
            date,
            count: attendance.length,
            attendance
        });

    } catch (error) {

        console.error("Get attendance by date error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance."
        });
    }
};


// ==========================================
// CREATE ATTENDANCE
// ADMIN / TEACHER
// ==========================================

exports.createAttendance = async (req, res) => {
    try {

        const {
            student_id,
            attendance_date,
            status,
            remarks
        } = req.body;


        // Required fields

        if (
            !student_id ||
            !attendance_date ||
            !status
        ) {
            return res.status(400).json({
                success: false,
                message: "Student, attendance date and status are required."
            });
        }


        // Validate date

        if (!/^\d{4}-\d{2}-\d{2}$/.test(attendance_date)) {
            return res.status(400).json({
                success: false,
                message: "Date must use YYYY-MM-DD format."
            });
        }


        // Validate status

        const allowedStatuses = [
            "Present",
            "Absent",
            "Late",
            "Excused"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance status."
            });
        }


        // Logged-in user records attendance

        const recordedBy = req.user.id;


        const attendanceId =
            await Attendance.create({
                student_id,
                attendance_date,
                status,
                recorded_by: recordedBy,
                remarks
            });


        const attendance =
            await Attendance.getById(attendanceId);


        res.status(201).json({
            success: true,
            message: "Attendance recorded successfully.",
            attendance
        });

    } catch (error) {

        console.error("Create attendance error:", error);


        // Duplicate attendance

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "Attendance has already been recorded for this student on this date."
            });
        }


        // Foreign key error

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                success: false,
                message:
                    "The specified student or user does not exist."
            });
        }


        res.status(500).json({
            success: false,
            message: "Failed to record attendance."
        });
    }
};


// ==========================================
// UPDATE ATTENDANCE
// ADMIN / TEACHER
// ==========================================

exports.updateAttendance = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            attendance_date,
            status,
            remarks
        } = req.body;


        const existing =
            await Attendance.getById(id);


        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found."
            });
        }


        // Teachers can only update records
        // they originally recorded.

        if (
            req.user.role === "teacher" &&
            existing.recorded_by !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only update attendance records you recorded."
            });
        }


        if (!attendance_date || !status) {
            return res.status(400).json({
                success: false,
                message:
                    "Attendance date and status are required."
            });
        }


        if (!/^\d{4}-\d{2}-\d{2}$/.test(attendance_date)) {
            return res.status(400).json({
                success: false,
                message:
                    "Date must use YYYY-MM-DD format."
            });
        }


        const allowedStatuses = [
            "Present",
            "Absent",
            "Late",
            "Excused"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid attendance status."
            });
        }


        await Attendance.update(id, {
            attendance_date,
            status,
            remarks
        });


        const updated =
            await Attendance.getById(id);


        res.json({
            success: true,
            message:
                "Attendance updated successfully.",
            attendance: updated
        });

    } catch (error) {

        console.error("Update attendance error:", error);

        res.status(500).json({
            success: false,
            message:
                "Failed to update attendance."
        });
    }
};


// ==========================================
// DELETE ATTENDANCE
// ADMIN ONLY
// ==========================================

exports.deleteAttendance = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Attendance.getById(id);


        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Attendance record not found."
            });
        }


        await Attendance.delete(id);


        res.json({
            success: true,
            message:
                "Attendance record deleted successfully."
        });

    } catch (error) {

        console.error("Delete attendance error:", error);

        res.status(500).json({
            success: false,
            message:
                "Failed to delete attendance."
        });
    }
};
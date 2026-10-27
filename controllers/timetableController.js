const Timetable = require("../models/timetableModel");

// ======================================================
// GET ALL TIMETABLE ENTRIES
// ADMIN + TEACHER
// ======================================================

exports.getAllTimetable = async (req, res) => {
    try {

        const timetable = await Timetable.getAll();

        res.json({
            success: true,
            count: timetable.length,
            timetable
        });

    } catch (error) {

        console.error("Get timetable error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve timetable."
        });
    }
};


// ======================================================
// GET TIMETABLE ENTRY BY ID
// ======================================================

exports.getTimetableById = async (req, res) => {
    try {

        const timetable =
            await Timetable.getById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: "Timetable entry not found."
            });
        }

        res.json({
            success: true,
            timetable
        });

    } catch (error) {

        console.error(
            "Get timetable entry error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve timetable entry."
        });
    }
};


// ======================================================
// GET TIMETABLE FOR A CLASS
// ======================================================

exports.getClassTimetable = async (req, res) => {
    try {

        const timetable =
            await Timetable.getByClass(
                req.params.classId
            );

        res.json({
            success: true,
            class_id: Number(req.params.classId),
            count: timetable.length,
            timetable
        });

    } catch (error) {

        console.error(
            "Get class timetable error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve class timetable."
        });
    }
};


// ======================================================
// GET TIMETABLE FOR A TEACHER
// ======================================================

exports.getTeacherTimetable = async (req, res) => {
    try {

        const timetable =
            await Timetable.getByTeacher(
                req.params.teacherId
            );

        res.json({
            success: true,
            teacher_id: Number(req.params.teacherId),
            count: timetable.length,
            timetable
        });

    } catch (error) {

        console.error(
            "Get teacher timetable error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve teacher timetable."
        });
    }
};


// ======================================================
// CREATE TIMETABLE ENTRY
// ADMIN ONLY
// ======================================================

exports.createTimetable = async (req, res) => {
    try {

        const {
            class_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room
        } = req.body;


        // ------------------------------------------
        // REQUIRED FIELDS
        // ------------------------------------------

        if (
            !class_id ||
            !subject_id ||
            !teacher_id ||
            !day_of_week ||
            !start_time ||
            !end_time
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Class, subject, teacher, day, start time and end time are required."
            });
        }


        // ------------------------------------------
        // VALIDATE DAY
        // ------------------------------------------

        const allowedDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        ];

        if (!allowedDays.includes(day_of_week)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid day of week."
            });
        }


        // ------------------------------------------
        // VALIDATE TIME
        // ------------------------------------------

        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message:
                    "End time must be later than start time."
            });
        }


        // ------------------------------------------
        // CREATE
        // ------------------------------------------

        const timetableId =
            await Timetable.create({
                class_id,
                subject_id,
                teacher_id,
                day_of_week,
                start_time,
                end_time,
                room
            });


        const timetable =
            await Timetable.getById(
                timetableId
            );


        res.status(201).json({
            success: true,
            message:
                "Timetable entry created successfully.",
            timetable
        });

    } catch (error) {

        console.error(
            "Create timetable error:",
            error
        );


        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Class, subject or teacher does not exist."
            });
        }


        res.status(500).json({
            success: false,
            message:
                "Failed to create timetable entry."
        });
    }
};


// ======================================================
// UPDATE TIMETABLE ENTRY
// ADMIN ONLY
// ======================================================

exports.updateTimetable = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Timetable.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Timetable entry not found."
            });
        }


        const {
            class_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room
        } = req.body;


        if (
            !class_id ||
            !subject_id ||
            !teacher_id ||
            !day_of_week ||
            !start_time ||
            !end_time
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Class, subject, teacher, day, start time and end time are required."
            });
        }


        const allowedDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        ];


        if (!allowedDays.includes(day_of_week)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid day of week."
            });
        }


        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message:
                    "End time must be later than start time."
            });
        }


        await Timetable.update(id, {
            class_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room
        });


        const timetable =
            await Timetable.getById(id);


        res.json({
            success: true,
            message:
                "Timetable entry updated successfully.",
            timetable
        });

    } catch (error) {

        console.error(
            "Update timetable error:",
            error
        );


        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Class, subject or teacher does not exist."
            });
        }


        res.status(500).json({
            success: false,
            message:
                "Failed to update timetable entry."
        });
    }
};


// ======================================================
// DELETE TIMETABLE ENTRY
// ADMIN ONLY
// ======================================================

exports.deleteTimetable = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Timetable.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Timetable entry not found."
            });
        }


        await Timetable.delete(id);


        res.json({
            success: true,
            message:
                "Timetable entry deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete timetable error:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to delete timetable entry."
        });
    }
};
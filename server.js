const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const db = require("./config/db");

// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/auth");
const classRoutes = require("./routes/classes");
const studentRoutes = require("./routes/students");
const subjectRoutes = require("./routes/subjects");
const teacherRoutes = require("./routes/teachers");
const resultRoutes = require("./routes/results");
const examRoutes = require("./routes/exams");
const attendanceRoutes = require("./routes/attendance");
const feeRoutes = require("./routes/fees");
const paymentRoutes = require("./routes/payments");
const parentRoutes = require("./routes/parents");
const announcementRoutes = require("./routes/announcements");
const notificationRoutes = require("./routes/notifications");
const schoolSettingsRoutes = require("./routes/schoolSettings");
const timetableRoutes = require("./routes/timetable");
const admissionRoutes = require("./routes/admissions");

// ===============================
// APP
// ===============================
const app = express();

// ===============================
// FRONTEND PATH
// ===============================
const frontendPath = path.join(__dirname, "..", "frontend");

// ===============================
// MIDDLEWARE
// ===============================
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "script-src": ["'self'"],
                "script-src-attr": ["'unsafe-inline'"],
                "style-src": ["'self'", "'unsafe-inline'", "https:"],
                "style-src-attr": ["'unsafe-inline'"]
            }
        }
    })
);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// ===============================
// SERVE FRONTEND
// ===============================
app.use(express.static(frontendPath));

// ===============================
// API ROUTES
// ===============================
app.use("/api/auth", authRoutes);

app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teachers", teacherRoutes);

app.use("/api/results", resultRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/admissions", admissionRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/fees", feeRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/parents", parentRoutes);

app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/timetable", timetableRoutes);

app.use("/api/school-settings", schoolSettingsRoutes);

// ===============================
// FRONTEND HOME PAGE
// ===============================
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ===============================
// API HEALTH CHECK
// ===============================
app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT NOW() AS server_time"
        );

        res.json({
            success: true,
            database: "Connected",
            server_time: rows[0].server_time
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            database: "Disconnected",
            error: error.message
        });
    }
});

// ===============================
// 404 API HANDLER
// ===============================
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );
});
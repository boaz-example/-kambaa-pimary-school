const Announcement = require("../models/announcementModel");

// ==========================================
// GET ALL ANNOUNCEMENTS
// ADMIN + TEACHER
// ==========================================

exports.getAllAnnouncements = async (req, res) => {
    try {

        const announcements = await Announcement.getAll();

        res.json({
            success: true,
            count: announcements.length,
            announcements
        });

    } catch (error) {

        console.error("Get announcements error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve announcements."
        });
    }
};


// ==========================================
// GET PUBLISHED ANNOUNCEMENTS
// AUTHENTICATED USERS
// ==========================================

exports.getPublishedAnnouncements = async (req, res) => {
    try {

        const announcements =
            await Announcement.getPublished();

        res.json({
            success: true,
            count: announcements.length,
            announcements
        });

    } catch (error) {

        console.error(
            "Get published announcements error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve published announcements."
        });
    }
};


// ==========================================
// GET ANNOUNCEMENT BY ID
// ADMIN + TEACHER
// ==========================================

exports.getAnnouncementById = async (req, res) => {
    try {

        const announcement =
            await Announcement.getById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found."
            });
        }

        res.json({
            success: true,
            announcement
        });

    } catch (error) {

        console.error(
            "Get announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve announcement."
        });
    }
};


// ==========================================
// CREATE ANNOUNCEMENT
// ADMIN + TEACHER
// ==========================================

exports.createAnnouncement = async (req, res) => {
    try {

        const {
            title,
            content,
            target_audience,
            published_at,
            status
        } = req.body;

        // ------------------------------------------
        // REQUIRED FIELDS
        // ------------------------------------------

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message:
                    "Title and content are required."
            });
        }

        // ------------------------------------------
        // VALIDATE AUDIENCE
        // ------------------------------------------

        const allowedAudiences = [
            "All",
            "Teachers",
            "Parents",
            "Students"
        ];

        const audience =
            target_audience || "All";

        if (!allowedAudiences.includes(audience)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid target audience."
            });
        }

        // ------------------------------------------
        // VALIDATE STATUS
        // ------------------------------------------

        const allowedStatuses = [
            "Draft",
            "Published",
            "Archived"
        ];

        const announcementStatus =
            status || "Draft";

        if (!allowedStatuses.includes(announcementStatus)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid announcement status."
            });
        }

        // ------------------------------------------
        // CREATE
        // ------------------------------------------

        const announcementId =
            await Announcement.create({
                title,
                content,
                target_audience: audience,
                created_by: req.user.id,
                published_at:
                    announcementStatus === "Published"
                        ? (published_at || new Date())
                        : null,
                status: announcementStatus
            });

        const announcement =
            await Announcement.getById(
                announcementId
            );

        res.status(201).json({
            success: true,
            message:
                "Announcement created successfully.",
            announcement
        });

    } catch (error) {

        console.error(
            "Create announcement error:",
            error
        );

        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "The creating user does not exist."
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to create announcement."
        });
    }
};


// ==========================================
// UPDATE ANNOUNCEMENT
// ADMIN + TEACHER
// ==========================================

exports.updateAnnouncement = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Announcement.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Announcement not found."
            });
        }

        const {
            title,
            content,
            target_audience,
            published_at,
            status
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message:
                    "Title and content are required."
            });
        }

        const allowedAudiences = [
            "All",
            "Teachers",
            "Parents",
            "Students"
        ];

        if (
            !allowedAudiences.includes(
                target_audience
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid target audience."
            });
        }

        const allowedStatuses = [
            "Draft",
            "Published",
            "Archived"
        ];

        if (
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid announcement status."
            });
        }

        await Announcement.update(id, {
            title,
            content,
            target_audience,
            published_at:
                status === "Published"
                    ? (published_at || existing.published_at || new Date())
                    : null,
            status
        });

        const announcement =
            await Announcement.getById(id);

        res.json({
            success: true,
            message:
                "Announcement updated successfully.",
            announcement
        });

    } catch (error) {

        console.error(
            "Update announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update announcement."
        });
    }
};


// ==========================================
// PUBLISH ANNOUNCEMENT
// ADMIN + TEACHER
// ==========================================

exports.publishAnnouncement = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Announcement.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Announcement not found."
            });
        }

        await Announcement.publish(id);

        const announcement =
            await Announcement.getById(id);

        res.json({
            success: true,
            message:
                "Announcement published successfully.",
            announcement
        });

    } catch (error) {

        console.error(
            "Publish announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to publish announcement."
        });
    }
};


// ==========================================
// ARCHIVE ANNOUNCEMENT
// ADMIN + TEACHER
// ==========================================

exports.archiveAnnouncement = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Announcement.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Announcement not found."
            });
        }

        await Announcement.archive(id);

        const announcement =
            await Announcement.getById(id);

        res.json({
            success: true,
            message:
                "Announcement archived successfully.",
            announcement
        });

    } catch (error) {

        console.error(
            "Archive announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to archive announcement."
        });
    }
};


// ==========================================
// DELETE ANNOUNCEMENT
// ADMIN ONLY
// ==========================================

exports.deleteAnnouncement = async (req, res) => {
    try {

        const { id } = req.params;

        const existing =
            await Announcement.getById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message:
                    "Announcement not found."
            });
        }

        await Announcement.delete(id);

        res.json({
            success: true,
            message:
                "Announcement deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete announcement."
        });
    }
};
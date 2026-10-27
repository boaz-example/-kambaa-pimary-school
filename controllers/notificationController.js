const Notification = require("../models/notificationModel");

// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

exports.getMyNotifications = async (req, res) => {
    try {
        const notifications =
            await Notification.getByUserId(req.user.id);

        res.json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve notifications."
        });
    }
};


// ======================================================
// GET MY UNREAD NOTIFICATIONS
// ======================================================

exports.getUnreadNotifications = async (req, res) => {
    try {
        const notifications =
            await Notification.getUnread(req.user.id);

        res.json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.error(
            "Get unread notifications error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve unread notifications."
        });
    }
};


// ======================================================
// GET NOTIFICATION BY ID
// USER CAN ONLY ACCESS THEIR OWN
// ======================================================

exports.getNotificationById = async (req, res) => {
    try {
        const notification =
            await Notification.getById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        // Security: normal users can only access
        // notifications belonging to themselves.
        if (
            notification.user_id !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        res.json({
            success: true,
            notification
        });

    } catch (error) {
        console.error(
            "Get notification error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve notification."
        });
    }
};


// ======================================================
// CREATE NOTIFICATION
// ADMIN ONLY
// ======================================================

exports.createNotification = async (req, res) => {
    try {
        const {
            user_id,
            title,
            message,
            type,
            related_type,
            related_id
        } = req.body;

        if (!user_id || !title || !message) {
            return res.status(400).json({
                success: false,
                message:
                    "User ID, title and message are required."
            });
        }

        const allowedTypes = [
            "Info",
            "Success",
            "Warning",
            "Alert"
        ];

        const notificationType =
            type || "Info";

        if (!allowedTypes.includes(notificationType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification type."
            });
        }

        const notificationId =
            await Notification.create({
                user_id,
                title,
                message,
                type: notificationType,
                related_type,
                related_id
            });

        const notification =
            await Notification.getById(
                notificationId
            );

        res.status(201).json({
            success: true,
            message:
                "Notification created successfully.",
            notification
        });

    } catch (error) {
        console.error(
            "Create notification error:",
            error
        );

        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "The specified user does not exist."
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to create notification."
        });
    }
};


// ======================================================
// MARK NOTIFICATION AS READ
// ======================================================

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows =
            await Notification.markAsRead(
                id,
                req.user.id
            );

        if (!affectedRows) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found."
            });
        }

        res.json({
            success: true,
            message:
                "Notification marked as read."
        });

    } catch (error) {
        console.error(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to mark notification as read."
        });
    }
};


// ======================================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================================

exports.markAllAsRead = async (req, res) => {
    try {
        const affectedRows =
            await Notification.markAllAsRead(
                req.user.id
            );

        res.json({
            success: true,
            message:
                "All notifications marked as read.",
            updated: affectedRows
        });

    } catch (error) {
        console.error(
            "Mark all notifications read error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to mark notifications as read."
        });
    }
};


// ======================================================
// DELETE MY NOTIFICATION
// ======================================================

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows =
            await Notification.delete(
                id,
                req.user.id
            );

        if (!affectedRows) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found."
            });
        }

        res.json({
            success: true,
            message:
                "Notification deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete notification error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete notification."
        });
    }
};
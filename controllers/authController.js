const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

// ==========================================
// USER LOGIN
// ==========================================

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findByEmail(normalizedEmail);

        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (Number(user.password_set) === 0) {
            return res.status(403).json({
                success: false,
                firstTime: true,
                message: "Please set your password before logging in."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (
            user.status &&
            String(user.status).toLowerCase() !== "active"
        ) {
            return res.status(403).json({
                success: false,
                message: "Your account is not active. Please contact the administrator."
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                status: user.status
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to log in."
        });
    }
};

// ==========================================
// REGISTER USER
// ==========================================

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findByEmail(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userId = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
            phone: phone ? phone.trim() : null,
            password_set: 1
        });

        const user = {
            id: userId,
            name: name.trim(),
            email: normalizedEmail,
            role: "user",
            phone: phone ? phone.trim() : null
        };

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
            user
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to register the user."
        });
    }
};

// ==========================================
// CHECK FIRST-TIME ACCOUNT
// ==========================================

exports.checkFirstTime = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findFirstTimeUser(normalizedEmail);

        if (!user) {
            return res.status(200).json({
                success: true,
                firstTime: false,
                message: "No first-time account found for this email."
            });
        }

        return res.status(200).json({
            success: true,
            firstTime: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("CHECK FIRST TIME ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to check account."
        });
    }
};

// ==========================================
// SET FIRST-TIME PASSWORD
// ==========================================

exports.setFirstPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, password and confirm password are required."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findFirstTimeUser(normalizedEmail);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No first-time account was found for this email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const affectedRows = await User.setPassword(
            user.id,
            hashedPassword
        );

        if (!affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Password could not be updated."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password created successfully. You can now log in.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("SET FIRST PASSWORD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create password."
        });
    }
};

// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================

exports.profile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve profile."
        });
    }
};

// ==========================================
// VERIFY EXPORTED CONTROLLER FUNCTIONS
// ==========================================

console.log("AUTH CONTROLLER FUNCTIONS:", {
    login: typeof exports.login,
    register: typeof exports.register,
    checkFirstTime: typeof exports.checkFirstTime,
    setFirstPassword: typeof exports.setFirstPassword,
    profile: typeof exports.profile
});
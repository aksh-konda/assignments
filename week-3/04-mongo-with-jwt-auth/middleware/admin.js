const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../util/Env");
const { Admin } = require("../db");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if(!decoded.adminId) {
            return res.status(401).json({message: "Malformed token: Missing admin ID"});
        }
        const admin = await Admin.findById(decoded.adminId);
        if(!admin) {
            return res.status(401).json({message: "Unauthorized: Admin not found"});
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Invalid Token" });
    }
}

module.exports = adminMiddleware;
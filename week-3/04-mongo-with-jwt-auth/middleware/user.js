const { User } = require("../db");
const { getJwtSecret } = require("../util/Env");

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const authHeader = req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if(!decoded.userId) {
            return res.status(401).json({message: "Malformed token: Missing user ID"});
        }
        const user = await User.findById(decoded.userId);
        if(!user) {
            return res.status(401).json({message: "Unauthorized: User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
}

module.exports = userMiddleware;
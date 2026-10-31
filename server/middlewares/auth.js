const jwt = require("jsonwebtoken");
const User = require("../models/User");

const fail = (res, status, message) => res.status(status).json({ success: false, message });

// Is the token valid? Accepts the Authorization header (used by the SPA)
// or the httpOnly cookie. The request body is never trusted for a token.
exports.auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    const bearer = header && header.startsWith("Bearer ") ? header.slice(7).trim() : null;
    const token = bearer || req.cookies?.token;
    if (!token) return fail(res, 401, "Token missing");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return fail(res, 401, "Token is invalid or expired");
    }

    // the account may have been deleted or deactivated after the token was issued
    const user = await User.findById(decoded.id).select("accountType active");
    if (!user || user.active === false) return fail(res, 401, "Account no longer exists");

    req.user = { id: decoded.id, email: decoded.email, accountType: user.accountType };
    next();
  } catch (err) {
    console.error(err);
    return fail(res, 500, "Something went wrong while validating the token");
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user?.accountType !== role) {
    return fail(res, 403, `This is a protected route for ${role}s only`);
  }
  next();
};

exports.isStudent = requireRole("Student");
exports.isInstructor = requireRole("Instructor");
exports.isAdmin = requireRole("Admin");

import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { getSessionByToken, getUserById } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "nexusai-dev-secret-change-in-production";

export function signToken(userId, rememberMe = false) {
  const expiresIn = rememberMe ? "30d" : "1d";
  return jwt.sign({ sub: userId, jti: randomUUID() }, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.headers["x-auth-token"];
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const session = getSessionByToken(token);
  const payload = verifyToken(token);
  if (!session && !payload) {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }

  const userId = session?.user_id || payload?.sub;
  const user = getUserById(userId);
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  req.user = user;
  req.token = token;
  next();
}

export { JWT_SECRET };

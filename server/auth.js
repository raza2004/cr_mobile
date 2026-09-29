import jwt from "jsonwebtoken";

const TOKEN_TTL = "30d";

export function signToken(client) {
  return jwt.sign(
    { _id: client._id.toString(), email: client.email, name: client.fullName },
    process.env.TOKEN_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

// Replaces next-auth's getServerSession: reads `Authorization: Bearer <token>`
// and exposes the payload as req.user.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    (req as any).user = decoded;
    next();
  });
};

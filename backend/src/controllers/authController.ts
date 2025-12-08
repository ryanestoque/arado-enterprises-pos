import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { auditLog } from "../utils/auditLogger";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      password,
      role,
      first_name,
      last_name,
    } = req.body

    const hashed = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO Users
      (username, password, role, first_name,  last_name)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [username, hashed, role, first_name,  last_name];

    const [result] = await db.query<ResultSetHeader>(sql, values);

    await auditLog({
      user_id: (req as any).user.user_id,
      username: (req as any).user.username,
      module: "User",
      action: "REGISTRATION",
      description: `User "${username}" registered`,
      before: null,
      after: {
        user_id: result.insertId,
        username,
        role,
        first_name,
        last_name
      },
      ip: req.ip
    });
    
    const token = jwt.sign(
      { user_id: result.insertId, username },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Registration successful",
      token,
      user: {
        user_id: result.insertId,
        username,
        role,
        first_name,
        last_name
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add user" });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  try {
    const sql = "SELECT * FROM Users WHERE username = ?";
    const [rows] = await db.query<RowDataPacket[]>(sql, [username]);

    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if(user.status !== "Active") {
      return res.status(403).json({ message: "Account is currently suspended" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    await auditLog({
      user_id: user.user_id,
      username: user.username,
      module: "Auth",
      action: "LOGIN",
      description: `User "${user.username}" logged in`,
      before: null,
      after: { user_id: user.user_id, username: user.username },
      ip: req.ip
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // extracted by auth middleware

    await auditLog({
      user_id: user.user_id,
      username: (req as any).user.username,
      module: "Auth",
      action: "LOGOUT",
      description: `User "${user.username}" logged out`,
      before: null,
      after: null,
      ip: req.ip
    });

    res.json({ message: "Logout successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Logout failed" });
  }
};

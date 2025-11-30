import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

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
  const { username, password } = req.body;

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

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

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
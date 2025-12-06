import { Request, Response } from "express";
import db from "../config/db";
import bcrypt from "bcrypt"
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Users");
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM Users WHERE user_id = ?`, [user_id]);

    const user = (rows as any[])[0]; 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      res.json(user); 
    } catch(err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
}

export const addUser = async (req: Request, res: Response) => {
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

    res.json({ success: true, user_id: result.insertId})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add user" });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const {
      username,
      password,
      role,
      first_name,
      last_name,
    } = req.body;

    // Fetch "before" data for audit logs
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT user_id, username, role, first_name, last_name FROM Users WHERE user_id = ?`,
      [user_id]
    );

    const before = rows[0];

    if (!before) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build dynamic query
    let sql = `
      UPDATE Users SET 
        username=?, role=?, first_name=?, last_name=?
    `;

    const values: any[] = [username, role, first_name, last_name];

    // 🔥 Only include password if user actually typed something
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      sql += `, password=?`;
      values.push(hashed);
    }

    sql += ` WHERE user_id=?`;
    values.push(user_id);

    // Execute update
    await db.query(sql, values);

    const after = {
      user_id,
      username,
      role,
      first_name,
      last_name
    };

    await auditLog({
      user_id: (req as any).user.user_id,
      module: "User",
      action: "UPDATE",
      description: `Updated user "${username}"`,
      before,
      after,
      ip: req.ip
    });

    return res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try{
    const { user_id } = req.params;

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT user_id, username, role, first_name, last_name FROM Users WHERE user_id = ?`,
      [user_id]
    );

    const before = beforeRows[0];
    if (!before) {
      return res.status(404).json({ message: "Exchange not found" });
    }
  
    const sql = `
      DELETE FROM Users WHERE user_id=?
    `
    await db.query(sql, user_id);

    const action = detectAction(before, null);
    
    await auditLog({
      user_id: (req as any).user.user_id,
      module: "User",
      action,
      description: `User "${before.username}" deleted`,
      before,
      after: null,
      ip: req.ip
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

export const changeUsername = async (req: Request, res: Response) => {
  const userId = (req as any).user.user_id;
  const { username: newUsername } = req.body;

  try {
    // Get old username
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT username FROM Users WHERE user_id = ?",
      [userId]
    );
    const oldUsername = rows[0]?.username;

    // Update username
    await db.query(
      "UPDATE Users SET username = ? WHERE user_id = ?",
      [newUsername, userId]
    );

    // AUDIT LOG ✨
    await auditLog({
      user_id: userId,
      module: "User",
      action: "UPDATE",
      description: `${oldUsername} changed username to "${newUsername}"`,
      before: { username: oldUsername },
      after: { username: newUsername },
      ip: req.ip
    });

    res.json({ message: "Username updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update username" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as any).user.user_id;
  const { oldPassword, newPassword } = req.body;

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT password FROM Users WHERE user_id = ?",
      [userId]
    );
    const user = rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE Users SET password = ? WHERE user_id = ?",
      [hashedPassword, userId]
    );

    // AUDIT LOG ✨
    await auditLog({
      user_id: userId,
      module: "User",
      action: "UPDATE",
      description: `A user changed password`,
      before: null,  // NEVER store passwords!
      after: null,
      ip: req.ip
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update password" });
  }
};


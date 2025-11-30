import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Users");
    res.json(rows);
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

    const sql = `
      INSERT INTO Users
      (username, password, role, first_name,  last_name)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [username, password, role, first_name,  last_name];

    const [result] = await db.query<ResultSetHeader>(sql, values);
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
    } = req.body
  
    const sql = `
      UPDATE Users SET 
        username=?, password=?, role=?, first_name=?, last_name=?
      WHERE user_id=?
    `

    const values = [
      username, password, role, first_name, last_name,
      user_id
    ];
  
    await db.query(sql, values)
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try{
    const { user_id } = req.params;
  
    const sql = `
      DELETE FROM Users WHERE user_id=?
    `
    await db.query(sql, user_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
}
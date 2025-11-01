import { Request, Response } from "express";
import db from "../db";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Product");
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
import { Response, Request } from "express";
import db from "../db"

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Category");
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}
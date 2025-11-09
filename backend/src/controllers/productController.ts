import { Request, Response } from "express";
import db from "../config/db";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        s.name AS supplier_name
      FROM Product p
      LEFT JOIN Category c 
        ON p.category_id = c.category_id
      LEFT JOIN Supplier s
        ON p.supplier_id = s.supplier_id
          `);
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}
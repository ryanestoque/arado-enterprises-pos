import { Response, Request } from "express";
import db from "../config/db"
import { ResultSetHeader } from "mysql2";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Category");
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}

export const addCategory = async (req: Request, res: Response) => {
  try {
    const {
      name,
    } = req.body

    const sql = `
      INSERT INTO Category
      (name)
      VALUES (?)
    `;
    const values = [name];

    const [result] = await db.query<ResultSetHeader>(sql, values);
    res.json({ success: true, category_id: result.insertId})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add category" });
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.params;
    const {
      name
    } = req.body
  
    const sql = `
      UPDATE Category SET 
        name=?
      WHERE category_id=?
    `

    const values = [
      name, category_id
    ];
  
    await db.query(sql, values)
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update category" });
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try{
    const { category_id } = req.params;
  
    const sql = `
      DELETE FROM Category WHERE category_id=?
    `

    await db.query(sql, category_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
}
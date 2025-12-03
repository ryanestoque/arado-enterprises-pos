import { Response, Request } from "express";
import db from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

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
    const user = (req as any).user;
    const user_id = user.user_id;

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
    
    const category_id = result.insertId;

    const [afterRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM category WHERE category_id = ?`,
      [category_id]
    );

    const after = afterRows[0];

    const action = detectAction(null, after);

    await auditLog({
      user_id,
      module: "Category",
      action,
      description: `Category "${after.name}" added`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({ success: true, category_id: result.insertId})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add category" });
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const user_id = user.user_id;

    const { category_id } = req.params;
    const {
      name
    } = req.body

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM category WHERE category_id = ?`,
      [category_id]
    );

    const before = beforeRows[0];
  
    const sql = `
      UPDATE Category SET 
        name=?
      WHERE category_id=?
    `

    const values = [
      name, category_id
    ];
  
    await db.query(sql, values)

    const [afterRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM category WHERE category_id = ?`,
      [category_id]
    );

    const after = Array.isArray(afterRows) ? afterRows[0] : null;

    const action = detectAction(before, after)

    await auditLog({
      user_id,
      module: "Category",
      action,
      description: `Category "${before.name}" updated`,
      before,
      after,
      ip: req.ip  
    });

    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update category" });
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try{
    const { category_id } = req.params;

    const user = (req as any).user;
    const user_id = user.user_id;

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM category WHERE category_id = ?`,
      [category_id]
    );

    const before = beforeRows[0];
    if (!before) {
      return res.status(404).json({ message: "Category not found" });
    }
  
    const sql = `
      DELETE FROM Category WHERE category_id=?
    `

    await db.query(sql, category_id);

    const action = detectAction(before, null);

    await auditLog({
      user_id,
      module: "Category",
      action,
      description: `Category "${before.name}" deleted`,
      before,
      after: null,
      ip: req.ip
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
}
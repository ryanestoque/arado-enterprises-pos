import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

interface ReturnItemWithNames extends RowDataPacket {
  return_id: number;
  payment_item_id: number;
  return_quantity: number;
  return_date: string;
  return_reason: string;
  user_id: number;
  product_id: number;
  product_name: string;
  username: string;
  status: string;
}

export const getAllReturns = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ReturnItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
          `);
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch returned items" });
  }
}

export const makeReturn = async (req: Request, res: Response) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      return_quantity,
      return_reason,
      user_id,
      product_id,
      status
    } = req.body;

    const insertSql = `
      INSERT INTO ReturnItem
      (return_quantity, return_date, return_reason, user_id, product_id, status)
      VALUES (?, NOW(), ?, ?, ?, ?)
    `;
    const insertValues = [return_quantity, return_reason, user_id, product_id, status];

    const [insertResult] = await connection.query<ResultSetHeader>(
      insertSql,
      insertValues
    );

    // 2. Update product quantity
    // const updateSql = `
    //   UPDATE product
    //   SET stock_quantity = stock_quantity + ?
    //   WHERE product_id = ?
    // `;
    // await connection.query(updateSql, [quantity, product_id]);

    // If both succeed → commit
    await connection.commit();

    const return_id = insertResult.insertId;

    const [afterRows] = await db.query<ReturnItemWithNames[]>(
      `
      SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ReturnItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE return_id = ?
      `,
      [return_id]
    );

    const after = afterRows[0];

    const action = detectAction(null, after);

    await auditLog({
      user_id,
      username: (req as any).user.username,
      module: "Return",
      action,
      description: `Return for "${after.product_name}" recorded`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({
      success: true,
      return_id: insertResult.insertId,
      message: "Return recorded",
    });

  } catch (err) {
    console.error(err);
    await connection.rollback();
    res.status(500).json({ message: "Failed to return" });
  } finally {
    connection.release();
  }
};

export const updateReturn = async (req: Request, res: Response) => {
  try {
    const { return_id } = req.params;
    
    const {
      return_quantity,
      return_reason,
      user_id,
      product_id,
      status
    } = req.body;

    const [beforeRows] = await db.query<ReturnItemWithNames[]>(
      `SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ReturnItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE return_id = ?`,
      [return_id]
    );

    const before = beforeRows[0];

  
    const sql = `
      UPDATE ReturnItem SET 
        return_quantity=?, return_date=NOW(), return_reason=?, user_id=?, product_id=?, status=?
      WHERE return_id=?
    `

    const values = [
      return_quantity, return_reason, user_id, product_id, status, return_id, 
    ];
  
    await db.query(sql, values)

    const [afterRows] = await db.query<ReturnItemWithNames[]>(
      `SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ReturnItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE return_id = ?`,
      [return_id]
    );

    const after = Array.isArray(afterRows) ? afterRows[0] : null;

    const action = detectAction(before, after)

    await auditLog({
      user_id,
      username: (req as any).user.username,
      module: "ReturnItem",
      action,
      description: `Return for "${before.product_name}" updated`,
      before,
      after,
      ip: req.ip  
    });

    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update return_item" });
  }
}

export const deleteReturn = async (req: Request, res: Response) => {
  try{
    const { return_id } = req.params;

    const user = (req as any).user;
    const user_id = user.user_id;

    const [beforeRows] = await db.query<ReturnItemWithNames[]>(
      `SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ReturnItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE return_id = ?`,
      [return_id]
    );

    const before = beforeRows[0];
    if (!before) {
      return res.status(404).json({ message: "Return not found" });
    }
  
    const sql = `
      DELETE FROM ReturnItem WHERE return_id=?
    `

    await db.query(sql, return_id);

    const action = detectAction(before, null);

    await auditLog({
      user_id,
      username: (req as any).user.username,
      module: "Return",
      action,
      description: `Return for "${before.product_name}" deleted`,
      before,
      after: null,
      ip: req.ip
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete return" });
  }
}
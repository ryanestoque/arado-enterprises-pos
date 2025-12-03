import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

interface ExchangeItemWithNames extends RowDataPacket {
  exchange_id: number;
  payment_item_id: number;
  exchanged_quantity: number;
  exchange_date: string;
  exchange_reason: string;
  user_id: number;
  product_id: number;
  product_name: string;
  username: string;
}

export const getAllExchanges = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ExchangeItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
          `);
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exchanged items" });
  }
}

export const makeExchange = async (req: Request, res: Response) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      exchanged_quantity,
      exchange_reason,
      user_id,
      product_id
    } = req.body;

    const insertSql = `
      INSERT INTO ExchangeItem
      (exchanged_quantity, exchange_date, exchange_reason, user_id, product_id)
      VALUES (?, NOW(), ?, ?, ?)
    `;
    const insertValues = [exchanged_quantity, exchange_reason, user_id, product_id];

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

    const exchange_id = insertResult.insertId;

    const [afterRows] = await db.query<ExchangeItemWithNames[]>(
      `
      SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ExchangeItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE exchange_id = ?
      `,
      [exchange_id]
    );

    const after = afterRows[0];

    const action = detectAction(null, after);

    await auditLog({
      user_id,
      module: "Exchange",
      action,
      description: `Exchange for "${after.product_name}" recorded`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({
      success: true,
      exchange_id: insertResult.insertId,
      message: "Exchange recorded",
    });

  } catch (err) {
    console.error(err);
    await connection.rollback();
    res.status(500).json({ message: "Failed to exchange" });
  } finally {
    connection.release();
  }
};

export const updateExchange = async (req: Request, res: Response) => {
  try {
    const { exchange_id } = req.params;
    
    const {
      exchanged_quantity,
      exchange_reason,
      user_id,
      product_id
    } = req.body;

    const [beforeRows] = await db.query<ExchangeItemWithNames[]>(
      `SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ExchangeItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE exchange_id = ?`,
      [exchange_id]
    );

    const before = beforeRows[0];

  
    const sql = `
      UPDATE ExchangeItem SET 
        exchanged_quantity=?, exchange_date=NOW(), exchange_reason=?, user_id=?, product_id=?
      WHERE exchange_id=?
    `

    const values = [
      exchanged_quantity, exchange_reason, user_id, product_id, exchange_id,
    ];
  
    await db.query(sql, values)

    const [afterRows] = await db.query<ExchangeItemWithNames[]>(
      `SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ExchangeItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE exchange_id = ?`,
      [exchange_id]
    );

    const after = Array.isArray(afterRows) ? afterRows[0] : null;

    const action = detectAction(before, after)

    await auditLog({
      user_id,
      module: "ExchangeItem",
      action,
      description: `Exchange for "${before.product_name}" updated`,
      before,
      after,
      ip: req.ip  
    });

    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update exchanged_item" });
  }
}

export const deleteExchange = async (req: Request, res: Response) => {
  try{
    const { exchange_id } = req.params;

    const user = (req as any).user;
    const user_id = user.user_id;

    const [beforeRows] = await db.query<ExchangeItemWithNames[]>(
      `SELECT 
        e.*,
        p.name AS product_name,
        u.username AS username
      FROM ExchangeItem e
      LEFT JOIN Product p 
        ON e.product_id = p.product_id
      LEFT JOIN Users u
        ON e.user_id = u.user_id
      WHERE exchange_id = ?`,
      [exchange_id]
    );

    const before = beforeRows[0];
    if (!before) {
      return res.status(404).json({ message: "Exchange not found" });
    }
  
    const sql = `
      DELETE FROM ExchangeItem WHERE exchange_id=?
    `

    await db.query(sql, exchange_id);

    const action = detectAction(before, null);

    await auditLog({
      user_id,
      module: "Exchange",
      action,
      description: `Exchange for "${before.product_name}" deleted`,
      before,
      after: null,
      ip: req.ip
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete exchange" });
  }
}
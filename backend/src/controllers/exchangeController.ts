import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader } from "mysql2";

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

    // 1. Insert stock-in record
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
  
    const sql = `
      UPDATE ExchangeItem SET 
        exchanged_quantity=?, exchange_date=NOW(), exchange_reason=?, user_id=?, product_id=?
      WHERE exchange_id=?
    `

    const values = [
      exchanged_quantity, exchange_reason, user_id, product_id, exchange_id,
    ];
  
    await db.query(sql, values)
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update exchanged_item" });
  }
}

export const deleteExchange = async (req: Request, res: Response) => {
  try{
    const { exchange_id } = req.params;
  
    const sql = `
      DELETE FROM ExchangeItem WHERE exchange_id=?
    `

    await db.query(sql, exchange_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete exchange" });
  }
}
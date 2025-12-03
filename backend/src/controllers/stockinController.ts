import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

export const getAllStockin = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        st.*,
        p.name AS product_name,
        s.name AS supplier_name,
        u.username AS username
      FROM Stockin st
      LEFT JOIN Product p
        ON st.product_id = p.product_id
      LEFT JOIN Users u
        ON st.user_id = u.user_id
      LEFT JOIN Supplier s
        ON st.supplier_id = s.supplier_id
        `);
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stock ins" });
  }
}

export const makeStockin = async (req: Request, res: Response) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      product_id,
      quantity,
      supplier_id,
      user_id,
    } = req.body;

    const insertSql = `
      INSERT INTO Stockin
      (date, product_id, quantity, supplier_id, user_id)
      VALUES (NOW(), ?, ?, ?, ?)
    `;
    const insertValues = [product_id, quantity, supplier_id, user_id];

    const [insertResult] = await connection.query<ResultSetHeader>(
      insertSql,
      insertValues
    );

    const updateSql = `
      UPDATE product
      SET stock_quantity = stock_quantity + ?
      WHERE product_id = ?
    `;
    await connection.query(updateSql, [quantity, product_id]);

    await connection.commit();

    const stockin_id = insertResult.insertId;

    const [afterRows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        st.*,
        p.name AS product_name,
        s.name AS supplier_name,
        u.username AS username
      FROM Stockin st
      LEFT JOIN Product p
        ON st.product_id = p.product_id
      LEFT JOIN Users u
        ON st.user_id = u.user_id
      LEFT JOIN Supplier s
        ON st.supplier_id = s.supplier_id
      WHERE stockin_id = ?
      `,
      [stockin_id]
    );

    const after = afterRows[0];

    const action = detectAction(null, after);

    await auditLog({
      user_id,
      module: "StockIn",
      action,
      description: `Stock in for "${after.product_name}" recorded`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({
      success: true,
      stockin_id: insertResult.insertId,
      message: "Stock-in recorded and product quantity updated",
    });

  } catch (err) {
    console.error(err);
    await connection.rollback();
    res.status(500).json({ message: "Failed to stock in" });
  } finally {
    connection.release();
  }
};
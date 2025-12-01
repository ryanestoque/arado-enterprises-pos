import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getAllStockin = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        st.*,
        p.name AS product_name,
        s.name AS supplier_name,
        u.username AS username
      FROM Stockin s
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

    // 1. Insert stock-in record
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

    // 2. Update product quantity
    const updateSql = `
      UPDATE product
      SET stock_quantity = stock_quantity + ?
      WHERE product_id = ?
    `;
    await connection.query(updateSql, [quantity, product_id]);

    // If both succeed → commit
    await connection.commit();

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
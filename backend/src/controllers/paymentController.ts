import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader } from "mysql2";

export const makePayment = async (req: Request, res: Response) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      user_id,
      original_total,
      discount_amount,
      total_amount,
      payment_method,
      discount_reason,
      items,
      amount_given,
      change_amount
    } = req.body

    // Insert payment record
    const [paymentResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO payment (date, user_id, original_total, discount_amount, total_amount, payment_method, discount_reason, amount_given, change_amount)
       VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, original_total, discount_amount, total_amount, payment_method, discount_reason, amount_given, change_amount]
    )

    const payment_id = paymentResult.insertId
    
    // Insert each item
    for (const item of items) {
      await connection.query(
        `INSERT INTO paymentitem (payment_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [payment_id, item.product_id, item.quantity, item.price]
      )

      // Optionally deduct stock
      await connection.query(
        `UPDATE product SET stock_quantity = stock_quantity - ? WHERE product_id = ?`,
        [item.quantity, item.product_id]
      )
    }

    await connection.commit()
    res.json({ success: true, payment_id })

  } catch (error) {
    await connection.rollback()
    console.error(error)
    res.status(500).json({ error: 'Failed to create payment' })
  } finally {
    connection.release()
  }
}
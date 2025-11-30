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

export const getPaymentById = async (req: Request, res: Response) => {
  const connection = await db.getConnection();
  const paymentId = Number(req.params.payment_id);

  try {
    // Get payment details
    const [paymentRows] = await connection.query(
      `SELECT p.payment_id, p.date, p.user_id, p.original_total, p.discount_amount, p.total_amount, 
              p.payment_method, p.discount_reason, p.amount_given, p.change_amount,
              u.username
       FROM payment p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.payment_id = ?`,
      [paymentId]
    );

    if (!paymentRows || (paymentRows as any[]).length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const payment = (paymentRows as any[])[0];

    // Get payment items with product info
    const [itemsRows] = await connection.query(
      `SELECT pi.paymentitem_id, pi.product_id, pi.quantity, pi.price, pr.name AS product_name
       FROM paymentitem pi
       JOIN product pr ON pi.product_id = pr.product_id
       WHERE pi.payment_id = ?`,
      [paymentId]
    );

    payment.items = itemsRows;

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payment" });
  } finally {
    connection.release();
  }
};
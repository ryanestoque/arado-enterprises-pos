import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

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

    const [paymentResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO payment (date, user_id, original_total, discount_amount, total_amount, payment_method, discount_reason, amount_given, change_amount)
       VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, original_total, discount_amount, total_amount, payment_method, discount_reason, amount_given, change_amount]
    )

    const payment_id = paymentResult.insertId
    
    for (const item of items) {
      await connection.query(
        `INSERT INTO paymentitem (payment_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [payment_id, item.product_id, item.quantity, item.price]
      )

      await connection.query(
        `UPDATE product SET stock_quantity = stock_quantity - ? WHERE product_id = ?`,
        [item.quantity, item.product_id]
      )
    }

    await connection.commit()

    const [[paymentInfo]] = await db.query<RowDataPacket[]>(
      `SELECT p.*, u.username 
       FROM payment p
       LEFT JOIN users u ON p.user_id = u.user_id
       WHERE payment_id = ?`,
      [payment_id]
    );

    const [paymentItems] = await db.query<RowDataPacket[]>(
      `SELECT pi.*, pr.name AS product_name 
       FROM paymentitem pi
       LEFT JOIN product pr ON pi.product_id = pr.product_id
       WHERE pi.payment_id = ?`,
      [payment_id]
    );

    const after = {
      ...paymentInfo,
      items: paymentItems
    };

    const action = detectAction(null, after);

    await auditLog({
      user_id,
      module: "Payment",
      action: "TRANSACTION",
      description: `Payment #${payment_id} created`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({ success: true, payment_id })

  } catch (error) {
    await connection.rollback()
    console.error(error)
    res.status(500).json({ error: 'Failed to create payment' })
  } finally {
    connection.release()
  }
}

const groupPaymentItems = (rows: any[]): any[] => {
  const paymentsMap: Map<number, any> = new Map();

  for (const row of rows) {
    const { 
      payment_id, 
      product_id, 
      item_quantity, 
      item_price, 
      product_name,
      original_total,
      discount_amount,
      total_amount,
      amount_given,
      change_amount,
      ...paymentDetails // Keep others
    } = row;

    if (!paymentsMap.has(payment_id)) {
      paymentsMap.set(payment_id, {
        ...paymentDetails,
        payment_id: payment_id,
        // ⭐ CONVERT THE NUMERIC FIELDS HERE
        original_total: parseFloat(original_total),
        discount_amount: parseFloat(discount_amount),
        total_amount: parseFloat(total_amount),
        amount_given: parseFloat(amount_given),
        change_amount: parseFloat(change_amount),
        items: []
      });
    }

    // Add the item details to the corresponding payment
    if (product_id) {
      paymentsMap.get(payment_id).items.push({
        product_id,
        product_name: product_name,
        item_quantity,
        item_price
      });
    }
  }

  return Array.from(paymentsMap.values());
};

export const getPaymentById = async (req: Request, res: Response) => {
  // 1. Get the ID from the URL parameters
  const payment_id = req.params.id; // Assuming route is '/api/payments/:id'
  
  // Basic validation
  if (!payment_id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }

  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT
        p.payment_id,
        p.date,
        p.original_total,
        p.discount_amount,
        p.total_amount,
        p.amount_given,
        p.change_amount,
        p.payment_method,
        p.discount_reason,
        u.username,
        u.first_name,
        u.last_name,
        pi.product_id,
        pi.quantity AS item_quantity,
        pi.price AS item_price,
        pr.name AS product_name
      FROM
        payment p
      INNER JOIN
        users u ON p.user_id = u.user_id
      LEFT JOIN
        paymentitem pi ON p.payment_id = pi.payment_id
      LEFT JOIN
        product pr ON pi.product_id = pr.product_id
      WHERE
        p.payment_id = ?
      ORDER BY
        pi.product_id
      `,
      [payment_id] // ⭐ Pass the ID as a safe parameter
    );

    const rowsArray = rows as any[];

    if (rowsArray.length === 0) {
        // If the query returns nothing, the ID wasn't found
        return res.status(404).json({ error: 'Payment not found' });
    }

    // 2. Group the results. Since there's only one payment ID, the result will be an array with one element.
    const groupedPayments = groupPaymentItems(rowsArray); 
    
    // 3. Return the single payment object
    res.json(groupedPayments[0]); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve payment details' });
  } finally {
    connection.release();
  }
};

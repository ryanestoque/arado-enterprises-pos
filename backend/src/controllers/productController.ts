import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        s.name AS supplier_name
      FROM Product p
      LEFT JOIN Category c 
        ON p.category_id = c.category_id
      LEFT JOIN Supplier s
        ON p.supplier_id = s.supplier_id
          `);
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

export const addProducts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const user_id = user.user_id;

    const {
      name,
      description,
      category_id,
      supplier_id,
      price,
      cost,
      stock_quantity,
      reorder_level,
      sku,
      barcode,
    } = req.body

    const sql = `
      INSERT INTO Product 
      (name, description, category_id, supplier_id, price, cost, stock_quantity, reorder_level, sku, barcode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, description, category_id, supplier_id, price, cost, stock_quantity, reorder_level, sku, barcode];

    const [result] = await db.query<ResultSetHeader>(sql, values);

    const product_id = result.insertId;

    const [afterRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM product WHERE product_id = ?`,
      [product_id]
    );

    const after = afterRows[0];

    const action = detectAction(null, after);

    await auditLog({
      user_id,
      module: "Product",
      action,
      description: `Product "${after.name}" added`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({ success: true, product_id: result.insertId})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;

    const user = (req as any).user;
    const user_id = user.user_id;

    const {
      name,
      description,
      category_id,
      supplier_id,
      price,
      cost,
      stock_quantity,
      reorder_level,
      sku,
      barcode,
    } = req.body

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM product WHERE product_id = ?`,
      [product_id]
    );

    const before = beforeRows[0];
  
    const sql = `
      UPDATE Product SET 
        name=?, description=?, category_id=?, supplier_id=?, price=?, cost=?, 
        stock_quantity=?, reorder_level=?, sku=?, barcode=?
      WHERE product_id=?
    `

    const values = [
      name, description ?? "", category_id, supplier_id,
      price, cost, stock_quantity, reorder_level ?? 0, sku, barcode ?? "",
      product_id
    ];
  
    await db.query(sql, values)

    const [afterRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM product WHERE product_id = ?`,
      [product_id]
    );

    const after = Array.isArray(afterRows) ? afterRows[0] : null;

    const action = detectAction(before, after)

    await auditLog({
      user_id,
      module: "Product",
      action,
      description: `Product "${before.name}" updated`,
      before,
      after,
      ip: req.ip  
    });

    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try{
    const { product_id } = req.params;

    const user = (req as any).user;
    const user_id = user.user_id;

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM product WHERE product_id = ?`,
      [product_id]
    );

    const before = beforeRows[0];
    if (!before) {
      return res.status(404).json({ message: "Product not found" });
    }
  
    const sql = `
      DELETE FROM Product WHERE product_id=?
    `

    await db.query(sql, product_id);

    const action = detectAction(before, null);

    await auditLog({
      user_id,
      module: "Product",
      action,
      description: `Product "${before.name}" deleted`,
      before,
      after: null,
      ip: req.ip
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
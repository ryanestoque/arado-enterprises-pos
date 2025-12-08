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
      image_url
    } = req.body

    const sql = `
      INSERT INTO Product 
      (name, description, category_id, supplier_id, price, cost, stock_quantity, reorder_level, sku, barcode, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, description, category_id, supplier_id, price, cost, stock_quantity, reorder_level, sku, barcode, image_url];

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
      username: (req as any).user.username,
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
      image_url
    } = req.body

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM product WHERE product_id = ?`,
      [product_id]
    );

    const before = beforeRows[0];
  
    const sql = `
      UPDATE Product SET 
        name=?, description=?, category_id=?, supplier_id=?, price=?, cost=?, 
        stock_quantity=?, reorder_level=?, sku=?, barcode=?, image_url=?
      WHERE product_id=?
    `

    const values = [
      name, description ?? "", category_id, supplier_id,
      price, cost, stock_quantity, reorder_level ?? 0, sku, barcode ?? "", image_url ?? "",
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
      username: (req as any).user.username,
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
      username: (req as any).user.username,
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

export const getTotalQuantity = async (req: Request, res: Response) => {
  const connection = await db.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT SUM(stock_quantity) AS total_quantity FROM product`
    );

    const result = rows as any[];

    return res.json({
      totalQuantity: result[0].total_quantity ?? 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get total quantity" });
  } finally {
    connection.release();
  }
};

export const getTotalInventoryValue = async (req: Request, res: Response) => {
  const connection = await db.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT SUM(stock_quantity * cost) AS total_value FROM product`
    );

    const result = rows as any[];

    return res.json({
      totalInventoryValue: result[0].total_value ?? 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get total inventory value" });
  } finally {
    connection.release();
  }
};
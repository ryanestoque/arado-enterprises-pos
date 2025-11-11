import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader } from "mysql2";

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
    res.json({ success: true, product_id: result.insertId})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
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

    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
}
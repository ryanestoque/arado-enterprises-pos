import { Response, Request } from "express";
import db from "../config/db"
import { ResultSetHeader } from "mysql2";

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Supplier");
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
}

export const addSupplier = async (req: Request, res: Response) => {
  try {
    const {
      name,
      contact_person,
      phone_number,
      email,
      address,
    } = req.body

    const sql = `
      INSERT INTO Supplier 
      (name, contact_person, phone_number, email, address)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, contact_person, phone_number, email, address];

    const [result] = await db.query<ResultSetHeader>(sql, values);
    res.json({ success: true, supplier_id: result.insertId})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add supplier" });
  }
}

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { supplier_id } = req.params;
    const {
      name,
      contact_person,
      phone_number,
      email,
      address,
    } = req.body
  
    const sql = `
      UPDATE Supplier SET 
        name=?, contact_person=?, phone_number=?, email=?, address=?
      WHERE supplier_id=?
    `

    const values = [
      name, contact_person, phone_number, email,
      address, supplier_id
    ];
  
    await db.query(sql, values)
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update supplier" });
  }
}

export const deleteSupplier = async (req: Request, res: Response) => {
  try{
    const { supplier_id } = req.params;
  
    const sql = `
      DELETE FROM Supplier WHERE supplier_id=?
    `

    await db.query(sql, supplier_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
}
import { Response, Request } from "express";
import db from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { auditLog, detectAction } from "../utils/auditLogger";

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
    const user = (req as any).user;
    const user_id = user.user_id;

    const {
      name,
      contact_person,
      phone_number,
      email,
      address,
      status
    } = req.body

    const sql = `
      INSERT INTO Supplier 
      (name, contact_person, phone_number, email, address, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, contact_person, phone_number, email, address, status];

    const [result] = await db.query<ResultSetHeader>(sql, values);

    const supplier_id = result.insertId;

    const [afterRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM Supplier WHERE supplier_id = ?`,
      [supplier_id]
    );

    const after = afterRows[0];

    const action = detectAction(null, after);

    await auditLog({
      user_id,
      username: (req as any).user.username,
      module: "Supplier",
      action,
      description: `Supplier "${after.name}" added`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({ success: true, supplier_id: result.insertId})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add supplier" });
  }
}

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { supplier_id } = req.params;

    const user = (req as any).user;
    const user_id = user.user_id;

    const {
      name,
      contact_person,
      phone_number,
      email,
      address,
      status
    } = req.body

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM supplier WHERE supplier_id = ?`,
      [supplier_id]
    );

    const before = beforeRows[0];
  
    const sql = `
      UPDATE Supplier SET 
        name=?, contact_person=?, phone_number=?, email=?, address=?, status=?
      WHERE supplier_id=?
    `

    const values = [
      name, contact_person, phone_number, email,
      address, status, supplier_id
    ];
  
    await db.query(sql, values)

    const [afterRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM supplier WHERE supplier_id = ?`,
      [supplier_id]
    );

    const after = Array.isArray(afterRows) ? afterRows[0] : null;

    const action = detectAction(before, after)

    await auditLog({
      user_id,
      username: (req as any).user.username,
      module: "Supplier",
      action,
      description: `Supplier "${before.name}" added`,
      before: null,
      after,
      ip: req.ip
    });

    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update supplier" });
  }
}

export const deleteSupplier = async (req: Request, res: Response) => {
  try{
    const { supplier_id } = req.params;

    const user = (req as any).user;
    const user_id = user.user_id;

    const [beforeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM supplier WHERE supplier_id = ?`,
      [supplier_id]
    );

    const before = beforeRows[0];
    if (!before) {
      return res.status(404).json({ message: "Supplier not found" });
    }
  
    const sql = `
      DELETE FROM Supplier WHERE supplier_id=?
    `

    await db.query(sql, supplier_id);

    const action = detectAction(before, null);

    await auditLog({
      user_id,
      username: (req as any).user.username,
      module: "Supplier",
      action,
      description: `Supplier "${before.name}" deleted`,
      before,
      after: null,
      ip: req.ip
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
}
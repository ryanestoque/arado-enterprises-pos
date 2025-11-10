import { Response, Request } from "express";
import db from "../config/db"

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Supplier");
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
}
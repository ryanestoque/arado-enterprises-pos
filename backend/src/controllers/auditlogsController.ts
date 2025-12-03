import { Request, Response } from "express";
import db from "../config/db";

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          a.audit_id,
          a.user_id,
          u.username,
          a.module,
          a.action,
          a.description,
          a.before_data,
          a.after_data,
          a.ip_address,
          a.created_at
        FROM auditlog a
        LEFT JOIN users u ON a.user_id = u.user_id
        ORDER BY a.created_at DESC;
        `
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

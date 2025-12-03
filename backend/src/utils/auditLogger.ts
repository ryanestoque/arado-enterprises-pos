import db from "../config/db";

export const auditLog = async ({
  user_id,
  module,
  action,
  description,
  before,
  after,
  ip
}: {
  user_id: number,
  module: string,
  action: string,
  description: string,
  before?: any,
  after?: any,
  ip?: string
}) => {
  await db.query(
    `INSERT INTO auditlog
      (user_id, module, action, description, before_data, after_data, ip_address) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      module,
      action,
      description,
      before ? JSON.stringify(before) : null,
      after ? JSON.stringify(after) : null,
      ip || null
    ]
  );
};

export function detectAction(before: any, after: any) {
  if (!before && after) return "CREATE";
  if (before && after) return "UPDATE";
  if (before && !after) return "DELETE";
  return "TRANSACTION"; // for payments, stock-in, etc.
}
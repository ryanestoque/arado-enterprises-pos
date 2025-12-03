import { Router } from "express";
import { getAuditLogs } from "../controllers/auditlogsController";

const router = Router();

router.get("/", getAuditLogs);

export default router;
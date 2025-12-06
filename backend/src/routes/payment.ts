import express from 'express'
import { deletePayment, getAllPayments, getBestSellingProduct, getGrossProfit, getPaymentById, getTotalRevenue, makePayment } from '../controllers/paymentController'

const router = express.Router()

router.post("/", makePayment);
router.get("/", getAllPayments);
router.get("/total_revenue", getTotalRevenue);
router.get("/best_selling", getBestSellingProduct);
router.get("/gross_profit", getGrossProfit);
router.get("/:id", getPaymentById);
router.delete("/:paymentId", deletePayment);

export default router

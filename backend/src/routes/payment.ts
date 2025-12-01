import express from 'express'
import { getPaymentById, makePayment } from '../controllers/paymentController'

const router = express.Router()

router.post("/", makePayment);
router.get("/:id", getPaymentById);


export default router

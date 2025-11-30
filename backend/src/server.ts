import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import productRoutes from "./routes/product"
import categoryRoutes from "./routes/category"
import paymentRoutes from "./routes/payment"
import supplierRoutes from "./routes/supplier"
import userRoutes from "./routes/user"
import authRoutes from "./routes/auth";
import { verifyToken } from "./middlewares/authMiddleware"

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get("/", async (req : Request, res : Response) => {
  res.send("POS Server is running...")
})

app.use(cors());
app.use(express.json());   // <-- MUST BE BEFORE ROUTES
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes)
app.use("/api/product", verifyToken, productRoutes)
app.use("/api/category", verifyToken, categoryRoutes)
app.use("/api/payment", verifyToken, paymentRoutes)
app.use("/api/supplier", verifyToken, supplierRoutes)
app.use("/api/user", verifyToken, userRoutes)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})

export default app;
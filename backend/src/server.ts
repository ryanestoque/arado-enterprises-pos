import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import productRoutes from "./routes/product"
import categoryRoutes from "./routes/category"

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get("/", async (req : Request, res : Response) => {
  res.send("POS Server is running...")
})

app.use("/api/product", productRoutes)
app.use("/api/category", categoryRoutes)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})

export default app;
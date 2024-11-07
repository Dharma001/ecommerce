import express from "express"
import NodeCache from "node-cache";
import { connectDB } from './utils/features.js';
import { errorMiddleware } from "./middlewares/error.js";

/* ROUTE IMPORTS */
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'
import orderRoute from './routes/order.js'

/* CONFIGURATIONS */
export const myCache = new NodeCache(); //the data will be stored in ram
const app = express();
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(errorMiddleware);
const port = 5000;
connectDB();

/* ROUTES */
app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);


/* SERVER */
app.listen(port , () => {
  console.log(`Server is working`)
})
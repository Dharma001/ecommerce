import express from "express"

import { connectDB } from './utils/features.js';
import { errorMiddleware } from "./middlewares/error.js";

/* ROUTE IMPORTS */
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'

/* CONFIGURATIONS */
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
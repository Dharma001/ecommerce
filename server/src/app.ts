import express from "express"
import NodeCache from "node-cache";
import { connectDB } from './utils/features.js';
import { errorMiddleware } from "./middlewares/error.js";
import { config } from 'dotenv';
import morgan from 'morgan';

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
app.use(morgan('dev')) // what request was triggred will be shown in terminal and their time
config({
  path:'./.env'
})

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || '';

connectDB(mongoURI);

/* ROUTES */
app.get('/', (req,res) => {
  res.send('API is workig.')
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/order', orderRoute);


/* SERVER */
app.listen(port, () => {
  console.log(`Server is working`)
})
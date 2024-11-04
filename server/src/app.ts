import express from 'express';


import userRoute from './routes/user.js'
import { connectDB } from './utils/features.js';

const app = express();
app.use(express.json())

const port = 5000;
connectDB();
//useing Routes
app.use('/api/v1/user', userRoute)
app.listen(port , () => {
  console.log(`Server is working`)
})
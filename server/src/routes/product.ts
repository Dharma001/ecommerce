import express from 'express';
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getlatestProducts, getProduct, newProduct, updateProduct } from '../controllers/product.js';
import { singleUpload } from '../middlewares/multer.js';
import { checkAdminRole } from '../middlewares/auth.js';

const app = express.Router();

app.post('/new', checkAdminRole, singleUpload, newProduct)
app.get('/latest', getlatestProducts)
app.get('/all', getAllProducts)
app.get('/categories', getAllCategories)
app.get('/admin-products', getAdminProducts)
app.route('/:id').get(getProduct).delete(checkAdminRole, deleteProduct).put(checkAdminRole, singleUpload, updateProduct)

export default app;
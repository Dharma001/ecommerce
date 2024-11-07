import express from 'express';
import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js';
import { checkAdminRole } from '../middlewares/auth.js';

const app = express.Router();

app.post('/new' , newUser)
app.get('/all', checkAdminRole, getAllUsers)

app.route('/:id').get(getUser).delete(checkAdminRole, deleteUser)
export default app;
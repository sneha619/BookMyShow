import express from 'express';
import { getProfile, login, register } from '../controller/user.controller.js';
import isLoggedIn  from '../middleware/authentication.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', isLoggedIn, getProfile);

export default router;
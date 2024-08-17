import express from 'express';
import { getProfile, login, register } from '../controller/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);

export default router;
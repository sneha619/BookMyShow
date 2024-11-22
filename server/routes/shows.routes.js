import {Router} from 'express';
import { createShow, listShow } from '../controller/shows.controller.js';
import authorizedRoles from '../middleware/authorization.js';
import isLoggedIn from '../middleware/authentication.js';

const router = Router();

router.post('/', isLoggedIn, authorizedRoles('ADMIN'), createShow);
router.get('/list', listShow);

export default router;
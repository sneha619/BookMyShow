import { Router } from "express";
import { createMovie, getMovies } from "../controller/movie.controller.js";
import isLoggedIn from "../middleware/authentication.js";
import  authorizedRoles  from "../middleware/authorization.js";

const router = Router();

router.post('/', isLoggedIn, authorizedRoles('ADMIN'), createMovie);
router.get('/list', getMovies);

export default router;
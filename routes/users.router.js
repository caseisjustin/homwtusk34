import { Router } from "express";
import { register } from "../controllers/users.controller.js"

const router = Router();

router.post("/users/register", register)

export default router;
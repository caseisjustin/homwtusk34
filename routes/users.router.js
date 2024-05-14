import { Router } from "express";
import { register, login, addBook, allBookData, getBookById, updateBook, deleteBook } from "../controllers/users.controller.js"

const router = Router();

// USERS
router.post("/users/register", register)
router.post("/users/login", login)
// ========================================


// BOOKS
router.post("/books", addBook)
router.get("/books", allBookData)
router.get("/books/:id", getBookById)
router.put("/books/:id", updateBook)
router.delete("/books/:id", deleteBook)


// ========================================
export default router;
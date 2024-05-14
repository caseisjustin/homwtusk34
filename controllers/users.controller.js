import { query } from "../utils/db.js"


function genDate(){
    let dat = new Date()
    return `${dat.getHours()}:${dat.getMinutes()}, ${dat.getDate()}/${dat.getMonth()}/${dat.getFullYear()}`
}
// user qismi===========================================
// USER REGISTR
export const register = async (req, res) =>{
    try {
        const {username, email, password} = await req.body[0]
        let ucheck = await query(`SELECT * FROM users WHERE name = $1`, [username])
        let echeck = await query(`SELECT * FROM users WHERE email = $1`, [email])
        if(ucheck.rows.length != 0){
            res.send(`User with name ${username} already exists`)
        }
        else if(echeck.rows.length != 0){
            res.send(`User with email ${email} already exists`)
        }
        else{
            await query("INSERT INTO users(name, email, password, created_at) VALUES($1, $2, $3, $4)", [username, email, password, genDate()])
            res.status(200).send("Registration success")
        }
    } catch (err) {
        res.status(500).send("Some error occured")
    }
}

// USER LOGIN
export const login = async (req, res) =>{
    try{
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password])
        if(data.rows.length != 0){
            res.status(200).send("SUCCESS loged in")
        }
        else{
            res.send("No such user")
        }
    }catch(err){
        res.send("An error reading data")
    }
}
// =====================================================



// BOOKS================================================
export const addBook = async (req, res) => {
    try {
        let {title, author, genre, username} = req.body[0]
        let tcheck = await query(`SELECT * FROM books WHERE title = $1`, [title])
        if(tcheck.length != 0){
            res.send("This book already exists")
        }else{
            if(title && author && genre && username){
                username = await query(`SELECT id FROM users WHERE name = $1`, [username])
                await query(`INSERT INTO books(title, author, publication_date, genre, user_id) VALUES($1, $2, $3, $4, $5)`, [title, author, genDate(), genre, username.rows[0].id])
                res.send("added")
            }
        }
    } catch (err) {
        res.send(`${err}`)
    }
}

// GET ALL BOOKS
export const allBookData = async (req, res) => {
    try {
        let result = await query(`SELECT * FROM books`)
        res.send(result.rows)
    } catch (err) {
        res.send("Couldn't read data from database")
    }
}

// GET BOOK BY ID
export const getBookById = async (req, res) => {
    try {
        let id = req.params.id
        let result = await query(`SELECT * FROM books WHERE id = $1`, [id])
        if(result.rows.length == 0){
            res.send(`No book with id ${id}`)
        }
        else
            res.send(result.rows)
    } catch (err) {
        res.send("Error while getting data from DB")
    }
}

// PUT BOOK DATA
export const updateBook = async (req, res) => {
    try {
        
    } catch (err) {
        res.send("An error while updating data")
    }
}
// try{
//     query("CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(30), email VARCHAR(40),password VARCHAR(30), created_at VARCHAR(40))")
//     query("CREATE TABLE books(id SERIAL PRIMARY KEY, title VARCHAR(30), author VARCHAR(40), publication_date VARCHAR(40), genre VARCHAR(30), user_id INT, FOREIGN KEY(user_id) REFERENCES users(id))")
//     query("CREATE TABLE comments(id SERIAL PRIMARY KEY, text VARCHAR(100), created_at VARCHAR(40), book_id INT, user_id INT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(book_id) REFERENCES books(id))")
//     query("CREATE TABLE photos(id SERIAL PRIMARY KEY, url VARCHAR(30), book_id INT, uploaded_at VARCHAR(40), FOREIGN KEY(book_id) REFERENCES books(id))")
// }catch(err){
//     console.log("Error creating table!")
// }
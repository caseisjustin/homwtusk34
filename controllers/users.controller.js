import { query } from "../utils/db.js"


function genDate(){
    let dat = new Date()
    return `${dat.getHours()}:${dat.getMinutes()}, ${dat.getDate()}/${dat.getMonth()}/${dat.getFullYear()}`
}
// USERS===========================================
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
        if(tcheck.rows.length != 0){
            res.send("This book already exists")
        }
        else{
            if(title && author && genre && username){
                username = await query(`SELECT id FROM users WHERE name = $1`, [username])
                if(username.rows.length == 0){
                    res.status(400).send("No user found with provided username")
                }
                else{
                    await query(`INSERT INTO books(title, author, publication_date, genre, user_id) VALUES($1, $2, $3, $4, $5)`, [title, author, genDate(), genre, username.rows[0].id])
                    res.send("added")
                }
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
        let id = req.params.id
        let { title, author, publication_date, genre } = req.body[0]
        if(title.length == 0){
            title = await query(`SELECT title FROM books WHERE id = $1`, [id])
            title = title.rows[0].title
        }
        else if(author.length == 0){
            author = await query(`SELECT author FROM books WHERE id = $1`, [id])
            author = author.rows[0].author
        }
        else if(publication_date.length == 0){
            publication_date = await query(`SELECT publication_date FROM books WHERE id = $1`, [id])
            publication_date = publication_date.rows[0].publication_date
        }
        else if(genre.length == 0){
            genre = await query(`SELECT genre FROM books WHERE id = $1`, [id])
            genre = genre.rows[0].genre
        }
        await query(`UPDATE books SET title = $1, author = $2, publication_date = $3, genre = $4 WHERE id = $5`, [title, author, publication_date, genre, id])
        res.send("Updated successfully")
    } catch (err) {
        res.send("An error while updating data")
    }
}

// DELETE BOOK
export const deleteBook = async (req, res) => {
    try {
        let id = req.params.id
        await query(`DELETE FROM books WHERE id = $1`, [id])
        res.send("DELETED data")
    } catch (err) {
        res.send("An error while deleting")
    }
}
// =====================================================





// COMMENTS
// ADD COMMENT TO BOOK
export const addComment = async (req, res) =>{
    try {
        let { text, book_title, username } = req.body[0]
        book_title = await query(`SELECT id FROM books WHERE title = $1`, [book_title])
        username = await query(`SELECT id FROM users WHERE name = $1`, [username])
        await query(`INSERT INTO comments(text, created_at, book_id, user_id) VALUES($1, $2, $3, $4)`, [text,  genDate(), book_title.rows[0].id, username.rows[0].id])
        res.send("Added comment SUCCESSFULY")
    } catch (err) {
        res.send("An error occured while adding comment.")
    }
}

// GET ALL COMMENTS
export const getComments = async (req, res) => {
    try {
        let id = req.params.id
        let result = await query(`SELECT * FROM comments WHERE book_id = $1`, [id])
        res.send(result.rows)
    } catch (err) {
        res.send("An error occured reading comments.")
    }
}
// =================================================




// PHOTOS
// ADD PHOTOS TO BOOK
export const addPhoto = async (req, res) =>{
    try {
        let { url, book_title } = req.body[0]
        book_title = await query(`SELECT id FROM books WHERE title = $1`, [book_title])
        await query(`INSERT INTO photos(url, uploaded_at, book_id) VALUES($1, $2, $3)`, [url,  genDate(), book_title.rows[0].id])
        res.send("Added photo SUCCESSFULY")
    } catch (err) {
        res.send("An error occured while adding photo.")
    }
}

// GET ALL PHOTOS
export const getPhotos = async (req, res) => {
    try {
        let id = req.params.id
        let result = await query(`SELECT * FROM photos WHERE book_id = $1`, [id])
        res.send(result.rows)
    } catch (err) {
        res.send("An error occured reading comments.")
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
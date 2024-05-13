import { query } from "../utils/db.js"


function genDate(){
    let dat = new Date()
    return `${dat.getHours()}:${dat.getMinutes()}, ${dat.getDate()}/${dat.getMonth()}/${dat.getFullYear()}`
}

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










// try{
//     query("CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(30), email VARCHAR(40),password VARCHAR(30), created_at VARCHAR(40))")
//     query("CREATE TABLE books(id SERIAL PRIMARY KEY, title VARCHAR(30), author VARCHAR(40), publication_date VARCHAR(40), genre VARCHAR(30), user_id INT, FOREIGN KEY(user_id) REFERENCES users(id))")
//     query("CREATE TABLE comments(id SERIAL PRIMARY KEY, text VARCHAR(100), created_at VARCHAR(40), book_id INT, user_id INT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(book_id) REFERENCES books(id))")
//     query("CREATE TABLE photos(id SERIAL PRIMARY KEY, url VARCHAR(30), book_id INT, uploaded_at VARCHAR(40), FOREIGN KEY(book_id) REFERENCES books(id))")
// }catch(err){
//     console.log("Error creating table!")
// }
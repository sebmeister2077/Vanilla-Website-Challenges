import express from 'express'
import cors from 'cors'
import { getDb } from './db.js'

const app = express()
app.use(express.static('public'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

getDb().then((db) => db.migrate())

// respond with "hello world" when a GET request is made to the homepage
app.get('/counter', (req, res) => {
    const currentCount = parseInt(req.query?.count ?? 0)
    res.send(
        `<button hx-get="/counter?count=${currentCount + 1}" hx-swap="outerHTML" class="h-20">${currentCount}</button>`,
    )
})

app.get('/todo', async (req, res) => {
    const db = await getDb()
    const todos = await db.all('SELECT * FROM Todos')
    res.send(/*html*/ `
    <form hx-boost='true' hx-post="/todo" hx-target="ul" hx-swap='beforeend' class="flex w-screen items-center justify-center flex-col gap-6">
        <ul>
        ${todos.map(
            (t) => /*html*/ `
            <li>${t.text} id:${t.id}</div>
            `,
        )}
        </ul>
        <input  type="text" value='hello' name='newtodo' class="bg-gunmetal"/>
        <button>Add todo</button>
    </form>
        `)
})
app.post('/todo', async (req, res) => {
    const db = await getDb()
    const statement = await db.prepare('INSERT INTO Todos("text") VALUES (@text);')
    const { newtodo } = req.body
    await statement.run({ '@text': newtodo })
    const newEntry = await db.get('SELECT * FROM Todos ORDER BY id DESC LIMIT 1;')
    res.send(/*html*/ `
            <li>${newEntry.text}</li>
        `)
})

app.delete('/clean', async (req, res) => {
    const db = await getDb()
    const name = await db.get('SHOW DATABASES;')
    console.log('name:', name)
    // await db.run('DROP DATABASE database;')
    res.status(200)
})
const port = 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

//TODO check if you can do sql injection with prepared statements

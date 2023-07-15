import express from 'express'
import cors from 'cors'
import { getDb } from './db.js'

const app = express()
app.use(express.static('public'))
app.use(cors())
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
        <div class="flex w-screen items-center justify-center flex-col gap-6">${todos.map(
            (t) => /*html*/ `
                <div>${t.text}</div>
            `,
        )}</div>
        `)
})
app.post('/todo', (req, res) => {})

const port = 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

//TODO check if you can do sql injection with prepared statements

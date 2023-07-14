import express from 'express'
import cors from 'cors'

const app = express()
import { getDb } from './db.js'

const port = 3000 // Choose any port number you prefer
app.use(cors())
getDb().then((db) => {
    db.migrate().then(() => {
        db.close()
    })
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/counter', (req, res) => {
    const currentCount = parseInt(req.query?.count ?? 0)
    res.send(
        `<button hx-get="/counter?count=${currentCount + 1}" hx-swap="outerHTML" class="h-20">${currentCount}</button>`
    )
})

app.get('/todo', async (req, res) => {
    const db = await getDb()
    db.exec('SELECT * FROM todos')
})
app.post('/todo', (req, res) => {})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

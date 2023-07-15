import express from 'express'
import cors from 'cors'
import { getDb } from './db.js'

const app = express()
app.use(express.static('public'))
app.use(cors())
;(async () => {
    console.log(1)
    const database = await getDb()
    console.log(2)
    await database.migrate()
    console.log(3)
    await database.close()
    console.log(4)

    // respond with "hello world" when a GET request is made to the homepage
    app.get('/counter', (req, res) => {
        const currentCount = parseInt(req.query?.count ?? 0)
        res.send(
            `<button hx-get="/counter?count=${
                currentCount + 1
            }" hx-swap="outerHTML" class="h-20">${currentCount}</button>`,
        )
    })

    app.get('/todo', async (req, res) => {
        const db = await getDb()
        const response = await db.all('SELECT * FROM todos')
        res.send(JSON.stringify(response))
    })
    app.post('/todo', (req, res) => {})

    const port = 3000
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
})()

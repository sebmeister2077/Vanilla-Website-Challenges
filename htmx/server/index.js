const express = require('express')
const app = express()
const cors = require('cors')

const port = 3000 // Choose any port number you prefer
app.use(cors())

// respond with "hello world" when a GET request is made to the homepage
app.get('/counter', (req, res) => {
    const currentCount = parseInt(req.query?.count ?? 0)
    res.send(
        `<button hx-get="/counter?count=${currentCount + 1}" hx-swap="outerHTML" class="h-20">${currentCount}</button>`
    )
})

app.post('/todo', (req, res) => {})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

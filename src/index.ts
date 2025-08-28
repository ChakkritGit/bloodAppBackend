import express from 'express'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello from Bun + Express!')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

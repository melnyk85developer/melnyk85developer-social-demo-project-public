import { app } from './app';
import { connectDB } from './db/db';
// import bodyParser from 'body-parser'

// app.use(bodyParser())
const port = process.env.PORT || 5000

const startApp = async () => {
  await connectDB()
  app.listen(port, () => {
    console.log(`Start server port ${port}`)
  })
}
startApp();
import { app } from './app';
// import bodyParser from 'body-parser'

// app.use(bodyParser())
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Start server port ${port}`)
})
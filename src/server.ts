import express from 'express'
import cors from 'cors'
import https from 'https'
import http from 'http'
import siteRoutes from './routes/site'
import { requestLog } from './middleware/request-Intercepter'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.all('*', requestLog)

app.use('/ping', siteRoutes)

const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => console.log(`Server running on port ${port} - http://localhost:3000/`))
}

const regularServer = http.createServer(app)

if (process.env.NODE_ENV === 'production') {

} else {
  const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000

  runServer(serverPort, regularServer)
}
import express from 'express'
import userRouter from './src/modules/user/user.routes.js'
import messageRouter from './src/modules/message/message.routes.js'
import db_connection from './DB/connection.js'
import {config} from 'dotenv'
config({path: './config/dev.config.env'})
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use('/user', userRouter)
app.use('/message', messageRouter)

db_connection()
app.listen(port, ()=> console.log(`server running on ${port}`))
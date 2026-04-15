import 'dotenv/config'
import express from 'express'
import { connectDb } from './Dbconnection.js'
import { errorHandler, logger } from './middleWare.js'
import testrouter from './Routes/testroute.js'
import authrouter from './Routes/authroute.js'
import dashroute from './Routes/dashroute.js'
import airoute from './Routes/airoutes.js'
import cors from 'cors'

const app = express()


const PortNumber = process.env.PORT || 3000

const url = process.env.DB_URL
if(!process.env.DB_URL){
    console.error(`DB_url is missing in .env`)
    process.exit(1)
}

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(logger)

app.use('/prepapp/auth',authrouter)

app.use('/prepapp/test',testrouter)

app.use('/prepapp/dash',dashroute)

app.use('/prepapp/ai',airoute)

app.use(errorHandler)

connectDb(url)
    .then(()=>{
        app.listen(PortNumber,()=>{
            console.log(`Running at http://localhost:${PortNumber}`);
            
        })
    })
    .catch((err)=>{
        console.log(err);
        
    })
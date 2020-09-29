/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Application } from 'express'
import mongoose from 'mongoose'
import dotEnv from 'dotenv'
import bodyParser from 'body-parser'
import routes from './routes/index'
import { setupEvents } from './services/events-services'

dotEnv.config() //Enable environment variables read.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        export interface Request {
            sessionData: any
        }
    }
}

const app: Application = express()
app.use(bodyParser.urlencoded({ extended: false })) //Enable urlencode body
app.use(bodyParser.json()) //Enable json body

routes(app)

const PORT: number | string = process.env.PORT || 4000

mongoose
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .connect(process.env.MONGO!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Connection Error', error)
    })

//Register for chaincode events
setupEvents()

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Application } from 'express'
import mongoose from 'mongoose'
import dotEnv from 'dotenv'
import bodyParser from 'body-parser'
import routes from './routes/index'
import Client, { ChaincodeEvent } from 'fabric-client'

const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-harvx-connection.json'
const GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-client-connection.json'

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

//Register for events
setupEvents()

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})

async function setupEvents() {
    const client = Client.loadFromConfig(CONNECTION_PROFILE_PATH)
    client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH)
    await client.initCredentialStores()
        .then(() => {
            console.log('credentials init ok')
        })
    const userContext = await client.loadUserFromStateStore('admin')
    await client.setUserContext(userContext)
    const channel = client.getChannel('grainchainchannel')
    //client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH)
    const channelHub = channel.newChannelEventHub('peer1.grainchain.io')

    channelHub.registerChaincodeEvent('gocc', 'loadAdded', loadAddedCallback)
    channelHub.connect({ full_block: false }, (err, status) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('Status: ', status)
        }
    })

}

function loadAddedCallback(event: ChaincodeEvent, blockNumber?: number | undefined, txId?: string | undefined, txStatus?: string | undefined) {
    if (event) {
        console.log('Load Added Event Callback Triggered: ', event.payload) 
        console.log('Load Added Event Callback Triggered: ', event.event_name)
        console.log('Load Added Event Callback Triggered: ', event.tx_id)
        console.log('Load Added Event Callback Triggered: ', event.chaincode_id)
        console.log('Load Added Event Callback Triggered: ', txStatus)
    } else {
        console.log('event error, empty')
    }
}
import Client, { ChaincodeEvent } from 'fabric-client'
import { putMQMessage } from './mq-services'
import dotEnv from 'dotenv'

dotEnv.config() //Enable environment variables read.

const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-harvx-connection.json'
const GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-client-connection.json'
const eventPeer = process.env.DEFAULT_EVENTS_PEER ?? ''

async function setupEvents(): Promise<void> {
    try {
        const client = Client.loadFromConfig(CONNECTION_PROFILE_PATH)
        client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH)
        await client.initCredentialStores()
            .then(() => {
                console.log('credentials init ok')
            })
            .catch((err)=>{
                throw err
            })
        const userContext = await client.loadUserFromStateStore('admin')
        await client.setUserContext(userContext)
        const channel = client.getChannel('grainchainchannel')
        //client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH)
        const channelHub = channel.newChannelEventHub(eventPeer)

        channelHub.registerChaincodeEvent('gocc', 'contractAdded', eReceiverCallback) //TODO change to receive any type of event from chaincode name x
        channelHub.connect({ full_block: false }, (err, status) => {
            if (err) {
                throw err
            } else {
                console.log('Status: ', status)
            }
        })
    } catch (error) { 
        console.log(error.message)
    }

}

function eReceiverCallback(event: ChaincodeEvent, blockNumber?: number | undefined, txId?: string | undefined, txStatus?: string | undefined) {
    if (event) {
        console.log('Event Callback Triggered: ', event.payload)
        console.log('Event Callback Triggered: ', event.event_name)
        console.log('Callback Triggered: ', event.tx_id)
        console.log('Event Callback Triggered: ', event.chaincode_id)
        console.log('Event Callback Triggered: ', txStatus)
        const eventSent = putMQMessage(`ChaincodeID: ${event.chaincode_id}, EventName: ${event.event_name}  Status:${txStatus}`, 'gcbc') // @message: string, @channel: RabitMQ-QueueName
        console.log(eventSent)
    } else {
        console.log('event error, empty')
        throw new Error(`Event Reception Error ${txId}`)
    }
}

export { setupEvents }
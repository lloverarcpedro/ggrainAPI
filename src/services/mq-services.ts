import amqp from 'amqplib/callback_api'

const putMQMessage = async (message: string, queue: string): Promise<string> => {
    try {
        amqp.connect('amqp://grainchain:gc2020bc@localhost', function (error: Error, connection) {
            if (error) {
                throw error
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1
                }

                channel.assertQueue(queue, {
                    durable: true
                })
                channel.sendToQueue(queue, Buffer.from(message), {
                    persistent: true
                })
                console.log(`'Sent: ${message}`)
            })
            setTimeout(function () {
                connection.close()
            }, 500)
        })
        return 'message in rabbit'
    } catch (error) {
        return error.message
    }
}
export { putMQMessage }
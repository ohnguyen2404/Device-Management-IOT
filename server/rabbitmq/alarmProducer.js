const amqp = require("amqplib/callback_api")

const RabbitMQProducer = {
    sendMessage(message) {
        amqp.connect("amqp://localhost", function (connectError, connection) {
            if (connectError) {
                throw connectError
            }

            connection.createChannel(function (channelError, channel) {
                if (channelError) {
                    throw channelError
                }

                const exchange = "transportExchange"

                channel.assertExchange(exchange, "fanout", {
                    durable: false,
                })

                channel.publish(exchange, "", Buffer.from(message))

                console.log(" [x] Sent %s", message)
            })

            setTimeout(function () {
                connection.close()
                process.exit(0)
            }, 500)
        })
    },
}

module.exports = RabbitMQProducer
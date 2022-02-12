const amqp = require("amqplib/callback_api")
const AlarmProducer = require("./alarmProducer")
const AlarmService = require("../services/alarm")

const onConsumeMsg = async (msg) => {
    console.log("message consumed:", msg)
    const obj_msg = JSON.parse(msg)
    const {name, deviceId, severity} = obj_msg
    await AlarmService.create({name, deviceId, severity})
    AlarmProducer.sendMessage(msg)
}

const RabbitMQConsumer = {
    startService() {
        amqp.connect("amqp://localhost", function (connectError, connection) {
            if (connectError) {
                throw connectError
            }
            connection.createChannel(function (channelError, channel) {
                if (channelError) {
                    throw channelError
                }

                const exchange = "alarmExchange"

                channel.assertExchange(exchange, "fanout", {
                    durable: false,
                })

                channel.assertQueue(
                    "",
                    {
                        exclusive: true,
                    },
                    function (aseertQueueError, q) {
                        if (aseertQueueError) {
                            throw aseertQueueError
                        }
                        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue)

                        channel.bindQueue(q.queue, exchange, "")

                        channel.consume(
                            q.queue,
                            function (msg) {
                                onConsumeMsg(msg.content.toString())
                            },
                            {
                                noAck: true,
                            }
                        )
                    }
                )
            })
        })
    },
}

module.exports = RabbitMQConsumer

const amqp = require("amqplib/callback_api")
const AlarmService = require("../services/alarm")
const DeviceService = require("../services/device")

const onConsumeMsg = async (msg) => {
    const obj_msg = JSON.parse(msg)
    console.log("message consumed:", obj_msg)
    const json_data = JSON.parse(obj_msg.data)
    const existDevice = await DeviceService.getById(json_data.deviceId)
    if (existDevice) {
        const {deviceId, name, severity} = json_data
        await AlarmService.create({deviceId, name, severity})
    }
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
                    durable: true,
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

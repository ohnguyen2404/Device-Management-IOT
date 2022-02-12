const amqp = require("amqplib/callback_api")

amqp.connect("amqp://localhost", function (connectError, connection) {
    if (connectError) {
        throw connectError
    }

    connection.createChannel(function (channelError, channel) {
        if (channelError) {
            throw channelError
        }

        const exchange = "alarmExchange"
        const msg = {
            deviceId: "e8fef382-0c4e-4ca5-88e1-460abd5ea8c4",
            name: "High temperature",
            severity: "HIGHEST",
        }

        const str_msg = JSON.stringify(msg)

        channel.assertExchange(exchange, "fanout", {
            durable: false,
        })

        channel.publish(exchange, "", Buffer.from(str_msg))

        console.log(" [x] Sent %s", msg)
    })

    setTimeout(function () {
        connection.close()
        process.exit(0)
    }, 500)
})

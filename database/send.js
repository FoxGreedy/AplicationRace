function sendTestDataSource(model, send) {

    send.on('message', (dados) => {
        let dadosJSON = JSON.parse(dados)
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let Newuplink = new model()

            Newuplink.devAdress = dadosJSON.meta.device
            // GPS
            Newuplink.gps.lat = dadosJSON.params.radio.hardware.gps.lat
            Newuplink.gps.lng = dadosJSON.params.radio.hardware.gps.lng
            Newuplink.gps.alt = dadosJSON.params.radio.hardware.gps.alt

            Newuplink.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    console.log("Uplink realizado com sucesso", Uplink)
                }
            })
        }
    })

}

module.exports = sendTestDataSource

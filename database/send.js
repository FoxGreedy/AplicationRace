function sendOficialDataSource(model, send) {

    send.on('message', (dados) => {
        let dadosJSON = JSON.parse(dados)
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let NewCoordinate = new model()

            // GPS

            let payload = dadosJSON.params.payload

            //Contruindo as informações em base 64
            let payload64 = new Buffer(payload, 'base64')

            //Decodificando as informações
            let payloadAscii = payload64.toString('ascii')

            let coordenadas = payloadAscii.split(',')
            let altidude = coordenadas[0]
            let latitude = coordenadas[1].replace(/[ ]+/g, '');
            let longitude = coordenadas[2].replace(/[ ]+/g, '');

            NewCoordinate.devAdress = dadosJSON.meta.device
            NewCoordinate.gps.alt = altidude
            NewCoordinate.gps.lat = latitude
            NewCoordinate.gps.lng = longitude

            NewCoordinate.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })
        }
    })
}

function sendTesteDataSource(model, send) {

    send.on('message', (dados) => {
        let dadosJSON = JSON.parse(dados)
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let NewCoordinate = new model()


            NewCoordinate.devAdress = dadosJSON.meta.device
            NewCoordinate.gps.lat = dadosJSON.params.radio.hardware.gps.lat
            NewCoordinate.gps.lng = dadosJSON.params.radio.hardware.gps.lng
            NewCoordinate.gps.alt = dadosJSON.params.radio.hardware.gps.alt

            NewCoordinate.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })
        }
    })
}


module.exports.Oficial = sendOficialDataSource
module.exports.Teste = sendTesteDataSource

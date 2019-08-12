const gps = require('../model/gps')
const dadosCompetidor = require('../model/dados')

function sendOficialDataSource(model, send) {

    send.on('message', (dados) => {
        let dadosJSON = JSON.parse(dados)
        let id = dadosJSON.meta.device
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let applicationEUI = dadosJSON.meta.application,
                payload = dadosJSON.params.payload

            if (applicationEUI === '1111111111111111') enviarPayloadVagoon(payload, model, id)
            if (applicationEUI === '64a7087a66259f75') enviarPayloadWelligton(payload, model, id)

        }
    })
}

function enviarPayloadWelligton(payload, model, id) {
    console.log('Payload', payload)

    //Contruindo as informações em base 64
    let payload16 = Buffer.from(payload, 'base64')
    var output = [];

    for (var i = 0; i < payload16.length; i++) {
        var char = payload16.toString('hex', i, i + 1); // i is byte index of hex
        output.push(char);
    };

    let latitude = `${hexToInt(output[4])}.${parseInt(output[5], 16)}${parseInt(output[6], 16)}`
    let longitude = `${hexToInt(output[7])}.${parseInt(output[8],16)}${parseInt(output[9], 16)}`

    if (Number(latitude) == 0 || Number(longitude) == 0) {

        console.log('Latitude e Longitude Não Definida')

    } else {

        NewCoordinate.devAdress = id
        NewCoordinate.gps.lat = latitude
        NewCoordinate.gps.lng = longitude

        NewCoordinate.save((err, Uplink) => {
            if (err) {
                console.error('erro', err)
            } else {
                pegarUltimasCoordenadas(Uplink.devAdress, -6)
                console.log("Coordenadas salvas com sucesso", Uplink)
            }
        })

    }

}

function enviarPayloadVagoon(payload, model, id) {

    let NewCoordinate = new model()
    //Contruindo as informações em base 64
    let payload64 = Buffer.from(payload, 'base64')

    //Decodificando as informações
    let payloadAscii = payload64.toString('ascii')

    let coordenadas = payloadAscii.split(',')


    if (coordenadas.length > 1) {
        let altitude = coordenadas[0]
        let latitude = coordenadas[1].replace(/[ ]+/g, '');
        let longitude = coordenadas[2].replace(/[ ]+/g, '');

        console.log(altitude, latitude, longitude)

        if (Number(latitude) == 0 || Number(longitude) == 0) {

            console.log('Latitude e Longitude Não Definida')

        } else {

            NewCoordinate.devAdress = id
            NewCoordinate.gps.alt = altitude
            NewCoordinate.gps.lat = latitude
            NewCoordinate.gps.lng = longitude

            NewCoordinate.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    pegarUltimasCoordenadas(Uplink.devAdress, -6)
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })

        }
    }

}

function hexToInt(hex) {
    if (hex.length % 2 != 0) {
        hex = "0" + hex;
    }
    var num = parseInt(hex, 16);
    var maxVal = Math.pow(2, hex.length / 2 * 8);
    if (num > maxVal / 2 - 1) {
        num = num - maxVal
    }
    return num;
}

function sendTesteDataSource(model, send) {

    send.on('message', (dados) => {
        let dadosJSON = JSON.parse(dados)
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let id = dadosJSON.meta.device
            let gps = dadosJSON.params.radio.hardware.gps

            let NewCoordinate = new model()
            NewCoordinate.devAdress = id
            NewCoordinate.gps.lat = gps.lat
            NewCoordinate.gps.lng = gps.lng
            NewCoordinate.gps.alt = gps.alt

            NewCoordinate.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    pegarUltimasCoordenadas(Uplink.devAdress, -6)
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })
        }
    })
}

function pegarUltimasCoordenadas(id, fuso) {
    gps.find({
        devAdress: id
    }).exec((err, data) => {
        if (err) {
            console.error('Error', err)
        } else {
            if (data.length >= 2) {
                data = data.reverse()
                console.log('Não da para fazer o calculo de ditancia')
                atualizarDistancia(id, pegarDistancia(data[0].gps, data[1].gps), fuso)
            } else {
                iniciarCalculoDistancia(id, fuso)
            }
        }
    })
}

function pegarDistancia(ultima, penultima) {
    "use strict";
    var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        R = 6371,
        dLat = deg2rad(penultima.lat - ultima.lat),
        dLng = deg2rad(penultima.lng - ultima.lng),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(ultima.lat))
            * Math.cos(deg2rad(ultima.lat))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return ((R * c * 1000).toFixed());
}

function calcularData(data, offset) {
    var milisegundos_com_utc = data.getTime() + (data.getTimezoneOffset() * 60000);
    return new Date(milisegundos_com_utc + (3600000 * offset));
}

function atualizarDistancia(id, distancia, fuso) {

    dadosCompetidor.find({ devAdress: id })
        .exec((err, data) => {
            if (err) {
                console.error('Error', err)
            } else {
                if (data.length !== 0) {

                    console.log('Distancia percorrida', distancia, 'Distancia Total', data[0].distanciaTotal)

                    distanciaTotal = Number(distancia) + Number(data[0].distanciaTotal)
                    dadosCompetidor.findOneAndUpdate({ devAdress: id },
                        {
                            $set: {
                                distanciaTotal: distanciaTotal,
                                distanciaAtual: distancia,
                                momentoAtual: calcularData(new Date(), fuso)
                            }
                        },
                        { upsert: true },
                        (err, data) => {
                            if (err) {
                                console.log('Error', err)
                            } else {
                                console.log('Dados atualizados com sucesso')
                            }
                        })
                }
            }
        })
}

function iniciarCalculoDistancia(id, fuso) {

    dadosCompetidor.findOneAndUpdate({ devAdress: id },
        { $set: { momentoInicio: calcularData(new Date(), fuso) } },
        { upsert: true },
        (err, data1) => {
            if (err) {
                console.log('Error', err)
            } else {
                console.log('Os dados foram atualizados para a atualização', data1)
            }
        })

}

module.exports.Oficial = sendOficialDataSource
module.exports.Teste = sendTesteDataSource

const gps = require('../model/gps')
const dadosCompetidor = require('../model/dados')

function sendOficialDataSource(model, send) {

    send.on('message', async (dados) => {
        let dadosJSON = JSON.parse(dados)
        let id = dadosJSON.meta.device
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let applicationEUI = dadosJSON.meta.application,
                payload = dadosJSON.params.payload

            let competidor = await dadosCompetidor.findOne({ devAdress: id })
            let { status } = competidor

            if (status === 99) {
                if (applicationEUI === '972a3d8621f7825a') enviarPayloadWelligton(payload, model, id)
                if (applicationEUI === '1111111111111111') enviarPayloadVagoon(payload, model, id)
            }

        }
    })
}

async function enviarPayloadWelligton(payload, model, id) {

    let payload16 = Buffer.from(payload, 'base64')
    var output = [];

    for (var i = 0; i < payload16.length; i++) {
        var char = payload16.toString('hex', i, i + 1); // i is byte index of hex
        output.push(char);
    };

    let NewCoordinate = new model()

    let latitude = `${hexToInt(output[4])}.${parseInt(output[5], 16)}${parseInt(output[6], 16)}${parseInt(output[7], 16)}`
    let longitude = `${hexToInt(output[8])}.${parseInt(output[9], 16)}${parseInt(output[10], 16)}${parseInt(output[11], 16)}`

    console.log('Latitude', latitude, 'Longitude', longitude)

    let dadoDuplicado = await model.findOne({
        devAdress: id,
        gps: {
            lat: latitude,
            lng: longitude
        }
    })

    console.log(dadoDuplicado)

    if (!dadoDuplicado) {

        if (Number(latitude) == 0 || Number(longitude) == 0) {
            console.log('Latitude e Longitude Não Definida')
        } else {

            NewCoordinate.devAdress = id
            NewCoordinate.gps.lat = latitude
            NewCoordinate.gps.lng = longitude
            NewCoordinate.momento = calcularData(new Date(), -3)

            await NewCoordinate.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    pegarUltimasCoordenadas(Uplink.devAdress, -3)
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })

        }
    }


}

function enviarPayloadVagoon(payload, model, id) {


    let payload64 = Buffer.from(payload, 'base64')
    let payloadAscii = payload64.toString('ascii')

    let coordenadas = payloadAscii.split(',')

    let NewCoordinate = new model()

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
                    pegarUltimasCoordenadas(Uplink.devAdress, -3)
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
                    pegarUltimasCoordenadas(Uplink.devAdress, -3)
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
                // console.log('Não da para fazer o calculo de ditancia')
                atualizarDistancia(id, pegarDistancia(data[0].gps, data[1].gps), fuso)
            }

            // Calculo do tempo no backEnd

            // else {
            //     iniciarCalculoDistancia(id, fuso)
            // }
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

// function iniciarCalculoDistancia(id, fuso) {

//     dadosCompetidor.findOneAndUpdate({ devAdress: id },
//         { $set: { momentoInicio: calcularData(new Date(), fuso) } },
//         { upsert: true },
//         (err, data1) => {
//             if (err) {
//                 console.log('Error', err)
//             } else {
//                 console.log('Os dados foram atualizados para a atualização', data1)
//             }
//         })

// }

module.exports.Oficial = sendOficialDataSource
module.exports.Teste = sendTesteDataSource

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
                if (applicationEUI === '972a3d8621f7825a') await enviarPayloadWelligton(payload, id)
                if (applicationEUI === '1111111111111111') await enviarPayloadVagoon(payload, model, id)
            }

        }
    })
}

async function enviarPayloadWelligton(payload, id) {
    let payload16 = Buffer.from(payload, 'base64')
    var output = [];

    for (var i = 0; i < payload16.length; i++) {
        var char = payload16.toString('hex', i, i + 1)
        output.push(char)
    };

    console.log(output)

    let latitude = `${hexToInt(output[4])}.${parseInt(output[5], 16)}${parseInt(output[6], 16)}${parseInt(output[7], 16)}`
    let longitude = `${hexToInt(output[8])}.${parseInt(output[9], 16)}${parseInt(output[10], 16)}${parseInt(output[11], 16)}`

    console.log(id, latitude, longitude)

    let dadoDuplicado = await gps.findOne({
        devAdress: id,
        gps: {
            alt: "1",
            lat: latitude,
            lng: longitude
        }
    })

    if (!dadoDuplicado) {
        if (Number(latitude) != 0 && Number(longitude) != 0) {
            await gps.create({
                devAdress: id,
                momento: calcularData(new Date(), -3),
                gps: {
                    alt: 1,
                    lat: latitude,
                    lng: longitude
                }
            })
            await pegarUltimasCoordenadas(id, -3)
        }
    }
}

async function pegarUltimasCoordenadas(id, fuso) {
    let data = await gps.find({ devAdress: id })
    if (data) {
        data = data.reverse()
        let distancia = pegarDistancia(data[0].gps, data[1].gps)
        console.log("Distancia percorrida agora: ", distancia)
        console.log(data[0].gps, data[1].gps)

        console.log("Distanciaaaaa",distancia)
        // if (distancia <= 300) {
            await atualizarDistancia(id, distancia, fuso)
        // } else {
        //     gps.findOneAndDelete(
        //         {
        //             devAdress: id,
        //             gps: data[0].gps
        //         })
        //     console.log('Mensagem erro')
        // }
    }
}

async function atualizarDistancia(id, distancia, fuso) {
    let dados = await dadosCompetidor.findOne({ devAdress: id })

    console.log('Dados retornados')
    if (dados) {
        console.log('Distancia percorrida', distancia, 'Distancia Total', dados.distanciaTotal)

        let distanciaTotalAtual = Number(dados.distanciaTotal) + Number(distancia)
        console.log(distanciaTotalAtual)

        dados.distanciaTotal = distanciaTotalAtual
        dados.distanciaAtual = distancia
        dados.momentoAtual = calcularData(new Date(), fuso)

        await dados.save()

        console.log(dados)
        // await dadosCompetidor.findOneAndUpdate({ devAdress: id },
        //     {
        //         $set: {
        //             distanciaTotal: distanciaTotalAtual,
        //             distanciaAtual: distancia,
        //             momentoAtual: calcularData(new Date(), fuso)
        //         }
        //     },
        //     { upsert: true })
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

function enviarPayloadVagoon(payload, model, id) {
    let payload64 = Buffer.from(payload, 'base64')
    let payloadAscii = payload64.toString('ascii')
    let coordenadas = payloadAscii.split(',')

    let NewCoordinate = new model()

    console.log(coordenadas)
    if (coordenadas.length > 1) {
        let altitude = coordenadas[0]
        let latitude = coordenadas[1].replace(/[ ]+/g, '');
        let longitude = coordenadas[2].replace(/[ ]+/g, '');

        console.log(altitude, latitude, longitude)

        // if (Number(latitude) == 0 || Number(longitude) == 0) {

        //     console.log('Latitude e Longitude Não Definida')

        // } else {

        NewCoordinate.devAdress = id
        NewCoordinate.gps.alt = altitude
        NewCoordinate.gps.lat = latitude
        NewCoordinate.gps.lng = longitude

        NewCoordinate.save((err, Uplink) => {
            if (err) {
                console.error('erro', err)
            } else {
                pegarUltimasCoordenadas(id, -3)
            }
        })

    }
}
// }


module.exports.Oficial = sendOficialDataSource

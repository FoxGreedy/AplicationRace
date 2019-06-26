const WebSocket = require('ws')

let urlUplink = `wss://ns.atc.everynet.io/api/v1.0/data?access_token=2d9b184febf54e4cb5c3c7029b827033&types=uplink,location&radio=1&duplicate=0&lora=1&devices=0004a30b0020a3c1`
ws = new WebSocket(urlUplink)

module.exports = ws

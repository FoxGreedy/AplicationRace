const env = process.env.NODE_ENV || 'dev'

const config = () => {
    switch (env) {
        case 'dev':
            return {
                bd_string: 'mongodb://master:tower2019@cluster0-shard-00-00-lpicg.mongodb.net:27017,cluster0-shard-00-01-lpicg.mongodb.net:27017,cluster0-shard-00-02-lpicg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
            }
        case 'hml':
            return {
                bd_string: 'mongodb://master:tower2019@cluster0-shard-00-00-lpicg.mongodb.net:27017,cluster0-shard-00-01-lpicg.mongodb.net:27017,cluster0-shard-00-02-lpicg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
            }
        case 'prod':
            return {
                bd_string: 'mongodb://master:tower2019@cluster0-shard-00-00-lpicg.mongodb.net:27017,cluster0-shard-00-01-lpicg.mongodb.net:27017,cluster0-shard-00-02-lpicg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
            }
            // Padrão Database
        default:
            return {
                bd_string: 'mongodb://master:tower2019@cluster0-shard-00-00-lpicg.mongodb.net:27017,cluster0-shard-00-01-lpicg.mongodb.net:27017,cluster0-shard-00-02-lpicg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
            }
    }
}

console.log(`Iniciando escuta com a API ${env.toUpperCase()}`)

module.exports = config()
const env = process.env.NODE_ENV || 'dev'

const config = () => {
    switch (env) {
        case 'dev':
            return {
                bd_string: 'mongodb+srv://master:EWYHrNjWQT8VMxSD@cluster0-lpicg.mongodb.net/test?retryWrites=true&w=majority'
            }
        case 'hml':
            return {
                bd_string: 'mongodb+srv://master:EWYHrNjWQT8VMxSD@cluster0-lpicg.mongodb.net/test?retryWrites=true&w=majority'
            }
        case 'prod':
            return {
                bd_string: 'mongodb+srv://master:EWYHrNjWQT8VMxSD@cluster0-lpicg.mongodb.net/test?retryWrites=true&w=majority'
            }
            // Padrão Database
        default:
            return {
                bd_string: 'mongodb+srv://master:EWYHrNjWQT8VMxSD@cluster0-lpicg.mongodb.net/test?retryWrites=true&w=majority'
            }
    }
}

console.log(`Iniciando escuta com a API ${env.toUpperCase()}`)

module.exports = config()
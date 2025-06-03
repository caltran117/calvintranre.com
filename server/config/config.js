import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

const config = {
    env: process.env.ENV || 'development',
    server: {
        port: process.env.PORT,
        url: process.env.SERVER_URL || 'http://localhost:4000'
    }
}

export default config
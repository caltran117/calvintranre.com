import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

const config = {
    env: process.env.ENV || 'development',
    server: {
        port: parseInt(process.env.PORT || '5000', 10),
        url: process.env.SERVER_URL || 'http://localhost:5000'
    },
    database: {
        url: process.env.DATABASE_URL
    },
    email: {
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM
    },
    client: {
        port: parseInt(process.env.CLIENT_PORT || '5173', 10),
        url: process.env.CLIENT_URL || 'http://localhost:5173'
    },
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        port: parseInt(process.env.ADMIN_PORT || '3000', 10),
        url: process.env.ADMIN_URL || 'http://localhost:3000'
    },
    security: {
        rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
        rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000 // 15 minutes
    },
}

export default config
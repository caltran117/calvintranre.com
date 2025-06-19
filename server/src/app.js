import express from 'express'
import router from './router/apiRouter.js'
import globalErrorHandler from './middleware/globalErrorHandler.js'
import responseMessage from './constant/responseMessage.js'
import httpError from './util/httpError.js'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(helmet())
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
]

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true
    })
)

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/v1', router)

app.use((req, res, next) => {
    try {
        throw new Error(responseMessage.ERROR.NOT_FOUND('route'))
    } catch (err) {
        httpError(next, err, req, 404)
    }
})

app.use(globalErrorHandler)

export default app
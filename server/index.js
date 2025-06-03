import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/apiRouter.js'
import config from './config/config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/v1', router);

app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found!',
    });
});

const onListening = () => {
    console.log(`🚀 Server is running on port ${config.server.port}`);
    console.log(`📡 Server endpoint: http://localhost:${config.server.port}`);
    if (!config.env || !config.server.port) {
    console.error('❗ Environment is not set. Please set it in your environment variables.');
  } else {
    console.log(`🔑 Server secret is set.`);
  }
};

app.listen(config.server.port, onListening);
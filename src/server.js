import express from 'express';
import path from 'path';
import cors from 'cors';
import { Telegraf } from 'telegraf';
const app = express();

app.use(cors());

import connection from './config/connectDB.js';
import webRoute from './routes/webRoute.js';
import apiRoute from './routes/apiRoute.js';
import configViewEngine from './config/viewEngine.js';

const port = 3008;



connection();

configViewEngine(app);
app.use(express.urlencoded({ extended: true })); //
app.use(express.json());
webRoute(app);
apiRoute(app);

// Cấu hình Express để phục vụ các tài nguyên tĩnh từ thư mục public
app.use(express.static("public"));
// app.listen(port, () => console.log(`Listening http://localhost:${port}`));

export default app;
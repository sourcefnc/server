import express from "express";
const router = express.Router();

import webController from '../controller/webController';
function webRoute(app) {
    // GET METHOD
    router.get('/dashboard', webController.dashboard)
    router.get('/', webController.joinMember);

    return app.use("/", router)
};

export default webRoute;
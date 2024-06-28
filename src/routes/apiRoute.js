import express from "express";
const router = express.Router();

import apiController from '../controller/apiController';
function apiRoute(app) {
    // GET METHOD
    router.get('/asset', apiController.asset);
    router.get('/', apiController.giftCountdown);

    router.get('/balance', apiController.getBalance)
    router.get('/data-flexible', apiController.dataFlexible)


    // POST METHOS
    router.post('/withdrawn-to-web3', apiController.handleWithdrawnWeb3Wallet)
    router.post('/claim-bonus', apiController.claimBonus)
    router.post('/update-wallet', apiController.updateWallet)
    router.post('/withdrawn-flexible', apiController.handleWithdrawnFlexible)
    router.post('/add-capital-flexible', apiController.handleAddCapitalFlexible)
    router.post('/register-bot', apiController.botRegister)

    return app.use("/api", router)
};

export default apiRoute;

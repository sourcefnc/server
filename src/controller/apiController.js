
import botService from '../service/botService';
const giftCountdown = async (req, res) => {
    console.log('received request !!!');
    return res.send('api');
}

const asset = async (req, res) => {
    console.log('received request !!! :', req);
    return res.json({
        message: "get request",
        code: 0
    });
}
const botRegister = async (req, res) => {
    console.log(req.body);
    // Xử lý dữ liệu nhận được
    let result = await botService.botRegister(req.body)
    console.log(result);
    return res.json(result)
}
const getBalance = async (req, res) => {
    const data = await botService.getBalance(req.query.userId);
    let result = data.result.dataValues;
    console.log(result);
    if (result === undefined) {
        return res.json({
            result: false
        })
    }
    return res.json({
        balance: result.balance,
        wallet: result.walletAddress
    })
}

const dataFlexible = async (req, res) => {
    console.log(req.query.userId);
    let data = await botService.getDataFlexible(req.query.userId)
    return res.json(data.result);
}

const handleAddCapitalFlexible = async (req, res) => {
    let action = await botService.updateDataFlexible(req.body.userId, req.body.quantity)
    return res.json(action)
}

const handleWithdrawnFlexible = async (req, res) => {
    console.log('ookok', req.body);
    let data = await botService.withdrawnFlexible(req.body.quantity, req.body.userId)
    return res.json(data)
}
const handleWithdrawnWeb3Wallet = async (req, res) => {
    console.log(req.body);

    let data = await botService.withdrawWeb3Wallet(req.body)
    console.log(data);
    return res.json(data)
}

const updateWallet = async (req, res) => {

    let data = await botService.handleUpdateWallet(req.body.userId, req.body.walletAddress)
    console.log('data controller');
    return res.json({
        action: 'Update wallet',
        result: data.result,
        code: 0
    })
}
const claimBonus = async (req, res) => {
    console.log(req.body);
    let data = await botService.handleReqBonus(req.body.userId)
    return res.json({
        action: 'claim bonus',
        result: '',
        code: 0
    })
}
module.exports = {
    giftCountdown, asset, botRegister, getBalance, dataFlexible,
    handleAddCapitalFlexible, handleWithdrawnFlexible, updateWallet,
    claimBonus, handleWithdrawnWeb3Wallet
}
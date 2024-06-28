import { Telegraf, Markup, Scenes, session } from 'telegraf';

const bot = new Telegraf('7439778841:AAEf2S0J8J5OiZfGx_MHtFt26ZtQcChETkw');
const adminTelegram = 6323253854;
const noticeRequestWithdrawToAdmin = async (userData, value) => {

    let data = `
user data: 
_username: ${userData.username},
_userId: ${userData.userId},
_wallet address: ${userData.walletAddress},
_balance: ${userData.balance},
_request withdraw to web 3 wallet: ${value}
    `
    await bot.telegram.sendMessage(adminTelegram, data,
        Markup.inlineKeyboard([
            Markup.button.callback('Completed', 'complete_withdraw_web3'),
        ])
    )
    return {
        userData,
        value
    }
}




module.exports = {
    noticeRequestWithdrawToAdmin
}
import { where } from "sequelize";
import db from "../modules";
import cron from 'node-cron';
import adminBot from '../admin/botService/service';
const checkUserExist = async (data) => {
    try {
        const user = await db.User_Telegram.findOne(
            {
                where: {
                    userId: data
                }
            }
        )
        if (user === null) {
            return false;
        }
        return true;
    } catch (error) {
        console.log('>>> Error service check user exist ...!!!', error);
    }
}
const getBalance = async (userId) => {
    // const user = await checkUserExist(userId)
    // if (user === null) {
    //     console.log('not user');
    //     return {
    //         action: 'Get balance information !',
    //         result: 'User does not exist !',
    //         code: 0
    //     }
    // }
    // console.log(user);
    const user = await db.User_Telegram.findOne({
        where: { userId }
    })
    if (user === null) {
        console.log('not user');
        return {
            action: 'Get balance information !',
            result: 'User does not exist !',
            code: 1
        }
    }
    return {
        action: 'Get balance information !',
        result: user,
        code: 0
    };
}
const botRegister = async (rawData) => {
    let checkUser = await checkUserExist(rawData.userId)
    console.log('Check user : ', checkUser);
    if (checkUser) {
        console.log('User already exists !!!');
        return {
            action: 'Regiser new user !',
            result: 'User already exists !',
            code: 0
        }
    }
    try {
        await db.User_Telegram.create({
            username: rawData.username,
            userId: rawData.userId,
            walletAddress: '',
            balance: '0'
        })
        await db.Flexible.create({
            userId: rawData.userId,
            capitalSatisfaction: 0.00000000,
            unwithdrawnProfits: 0.00000000,
            profitWithdrawn: 0.00000000,
            capitalAwaitingApproval: 0.00000000,
        })
        return {
            action: 'Regiser new user !',
            result: 'Register successfuly !',
            code: 0
        }
    } catch (error) {
        console.log('err: ', error);
        return {
            action: 'Regiser new user !',
            result: 'error !',
            code: 1
        }
    }
}

const getDataFlexible = async (userId) => {
    try {
        const user = await db.Flexible.findOne(
            { where: { userId: userId } }
        )
        if (user === null) {
            console.log('not user: ', user);
            return {
                action: 'Get data flexible',
                result: 'Not User',
                code: 0,
            }
        }
        return {
            action: 'Get data flexible',
            result: user.dataValues,
            code: 0,

        }

    } catch (error) {
        console.log('>>> Error service check data flexible ...!!!', error);
    }
}
const updateDataFlexible = async (userId, quantity) => {
    try {
        let dataFlexible = await getDataFlexible(userId)
        let beforeCapitalAwaitingApproval = dataFlexible.result.capitalAwaitingApproval;
        await db.Flexible.update({
            capitalAwaitingApproval: quantity + beforeCapitalAwaitingApproval
        }, { where: { userId: userId } });

        let userBalance = await getBalance(userId)
        let beforeUserBalance = userBalance.result.dataValues.balance;

        await db.User_Telegram.update({
            balance: beforeUserBalance - quantity
        }, { where: { userId: userId } })
        return {
            action: 'Add capital to flexible savings',
            result: `Added ${quantity} $TON to flexible savings !`,
            code: 0
        }
    } catch (error) {
        console.log('Add capital to flexible savings', error);
        return {
            action: 'Add capital to flexible savings',
            result: `Add capital error, please try again later!!`,
            code: 1
        }
    }

}
const withdrawnFlexible = async (quantity, userId) => {

    // quantity là số lượng người dùng muốn rút
    try {
        let user = await getBalance(userId)
        let userBalance = user.result.dataValues.balance;
        let userDataFlexible = await getDataFlexible(userId)
        let userMainBalance = userBalance; // Số dư balance chính >> FS: viết tắt Flexible Savings
        let balanceFS = userDataFlexible.result.capitalSatisfaction; // Số dư được nhận lãi tiết kiệm linh hoạt
        let unWithdrawnFS = userDataFlexible.result.unwithdrawnProfits;// Lợi nhuận chưa rút
        let withdrawnFS = userDataFlexible.result.profitWithdrawn; // Lợi nhuận đã rút
        let penddingFS = userDataFlexible.result.capitalAwaitingApproval // Số dư chờ thêm vào balanceFS
        console.log('result: ', userMainBalance, balanceFS, unWithdrawnFS, withdrawnFS, penddingFS);
        withdrawnFS += unWithdrawnFS;
        userMainBalance += quantity;
        if (unWithdrawnFS < quantity) { // trừ vào lãi chưa rút trước
            quantity -= unWithdrawnFS;
            unWithdrawnFS = 0;
        } else {
            unWithdrawnFS -= quantity;
            quantity = 0
        }
        if (quantity > 0) { // Nếu còn thì trưf tiếp vào số dư đang nhận lãi
            if (balanceFS < quantity) {
                quantity -= balanceFS;
                balanceFS = 0;
            } else {
                balanceFS -= quantity;
                quantity = 0
            }
        }
        if (quantity > 0) { // Nếu vẫn còn trừ tiếp vào số dư chờ duyệt
            if (penddingFS < quantity) {
                quantity -= penddingFS;
                penddingFS = 0;
            } else {
                penddingFS -= quantity;
                quantity = 0
            }
        }
        await db.User_Telegram.update({ balance: userMainBalance },
            { where: { userId } }
        )
        await db.Flexible.update({
            capitalSatisfaction: balanceFS,
            unwithdrawnProfits: unWithdrawnFS,
            profitWithdrawn: withdrawnFS,
            capitalAwaitingApproval: penddingFS
        }, { where: { userId } })
        console.log('result: ', userMainBalance, balanceFS, unWithdrawnFS, withdrawnFS, penddingFS);
        return {
            action: 'Withdraw flexible savings capital',
            result: 'Successfully withdraw flexible savings capital !',
            code: 0
        }
    } catch (error) {
        return {
            action: 'Withdraw flexible savings capital',
            result: 'Unsuccessful withdrawal of flexible savings capital !',
            code: 1
        }
    }
}


const withdrawWeb3Wallet = async (data) => {
    try {
        let userBalance = await getBalance(data.userId);
        if (userBalance.result.dataValues.withdrawRequest > 0) {
            return {
                action: 'Withdraw to web3 wallet !',
                result: 'Can\'t withdraw right now because you have a pending withdrawal order!',
                code: 0
            }
        }
        let newBalance = userBalance.result.dataValues.balance - data.value;
        console.log('bot 102191: ', userBalance);
        console.log('bot 102191: ', newBalance);
        await db.User_Telegram.update(
            {
                balance: newBalance,
                withdrawRequest: data.value
            },
            { where: { userId: data.userId } }
        );
        adminBot.noticeRequestWithdrawToAdmin(userBalance.result.dataValues, data.value);
        return {
            action: 'Withdraw to web3 wallet !',
            result: `Withdrawal is in progress, check the status on https://tonscan.org/address/${userBalance.result.dataValues.walletAddress}`,
            code: 0
        }
    } catch (error) {
        return {
            action: 'Withdraw to web3 wallet !',
            result: 'Withdraw to web3 wallet error',
            code: 1
        }
    }
}

const handleUpdateWallet = async (userId, wallet) => {
    try {
        let checkUser = await checkUserExist(userId)
        if (checkUser) {
            await db.User_Telegram.update(
                { walletAddress: wallet },
                { where: { userId } }
            )
            return {
                result: 'Wallet address updated successful !'
            }
        }
        return {
            result: 'Wallet address update failed !'
        }
    } catch (error) {
        return {
            result: 'An unknown error'
        }
    }
}

const noticeDepositWithdraw = async (data) => {

}



let receivedBonusToday = [];

const handleReqBonus = async (userId) => {

    let state = receivedBonusToday.includes(userId)
    if (state) {
        console.log('Today is claimed !');
        console.log(receivedBonusToday);
        return {
            action: 'Claim bonus',
            result: 'Try again tomorrow',
            code: 1
        }
    } else {
        receivedBonusToday.push(userId)
        console.log(receivedBonusToday);
        console.log('The user_ ' + userId + ' claimed bonus');
        return {
            action: 'Claim bonus',
            result: 'Claim bonus successful',
            code: 1
        }
    }

}

function botBonus(userId) {
    if (receivedBonusToday.length > 0) {
        setTimeout(() => {
            receivedBonusToday = []
        }, 10000)
    }
}
botBonus();
// xây dựng tính năng trả lãi lúc 00h00 và chuyển từ vốn chờ duyệt vào vốn nhận lãi
cron.schedule('0 0 * * *', () => {
    console.log('hello');
});
module.exports = {
    getBalance, botRegister, getDataFlexible, updateDataFlexible, withdrawnFlexible,
    handleUpdateWallet, handleReqBonus, withdrawWeb3Wallet,
}




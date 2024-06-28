import db from '../modules/index'

const countDown = async () => {
    let time = new Date()
    console.log(time.getFullYear());
}

const joinMemberService = async (rawData) => {

    try {
        await db.User.create({
            username: rawData.username,
            firstName: rawData.firstName,
            assetId: rawData.userId,
            walletAddress: '',
            balance: '0'
        })

        return {
            msg: 'Create new user successfuly !!',
            code: 0
        }
    } catch (error) {
        console.log('err: ', error);
        return {
            msg: 'Join Member not successful !',
            code: 1
        }
    }
}

module.exports = {
    countDown, joinMemberService
}
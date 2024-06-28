import service from '../service/service';

const joinMember = async (req, res) => {
    console.log(req.query);
    let result = await service.joinMemberService(req.query.userId)
    result.code === 0 ? res.redirect('/dashboard') : res.send(result.msg) // 0
}

const dashboard = async (req, res) => {
    service.countDown()
    console.log(req.query);

    let data = {
        TON: 121,
        BnZ: 13039,
        Coins: 203923,
    }
    return res.render("home.ejs", { data })
}

module.exports = {
    dashboard, joinMember
}

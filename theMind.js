class TheMind {
    static LOGIN = 0;
    static PLAYING = 1;
    static END = 2;

    constructor() {
        this.players = [];
        this.level = 0;
        this.state = TheMind.LOGIN;
    }

    addPlayer(req, res) {
        if (this.state != TheMind.LOGIN)
            return res.send({error: "Not on login phase."});
        const body = req.body;
        if (this.logged(body.user))
            return res.send({error: "User already logged"});
        this.players.push(body.user);
        console.log(`${body.user} added`);
        res.send({text: `${body.user} added`, url: "/game"});
    }

    logged(user) {
        console.log("checking ", user);
        if (typeof user !== 'string' || user.length == 0)
            return false;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == user)
                return true;
        }
        return false;
    }
}

module.exports = TheMind;
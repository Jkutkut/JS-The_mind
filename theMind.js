class TheMind {
    static LOGIN = 0;
    static PLAYING = 1;
    static INTER = 2;
    static END = 3;

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
        if (typeof user !== 'string' || user.length == 0)
            return false;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == user)
                return true;
        }
        return false;
    }

    status(user) {
        // console.log("Game status", user);
        const response = {
            state: this.state
        };
        switch (this.state) {
            case TheMind.PLAYING:
                response.cards = [2, 4, 8, 16, 32, 68];
                break;
            case TheMind.INTER:
                response.result = "43 (pepe) > 42 (juan)";
                break;
            case TheMind.END:
                response.result = "You managed to last until round 42";
                break;
        }
        return response;
    }
}

module.exports = TheMind;
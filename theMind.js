class Player {
    constructor(name) {
        this.name = name;
    }

    is(user) {
        return this.name == user;
    }
}

class TheMind {
    static LOGIN = 0;
    static PLAYING = 1;
    static INTER = 2;
    static END = 3;

    constructor() {
        this.players = [];
        this.level = 0; // First lvl is 1
        this.state = TheMind.LOGIN;
    }

    addPlayer(req, res) {
        if (this.state != TheMind.LOGIN)
            return res.send({error: "Not on login phase."}); // TODO refactor with render and error
        const body = req.body;
        if (this.logged(body.user))
            return res.send({error: "User already logged"}); // TODO refactor with render and error
        this.players.push(new Player(body.user));
        console.log(`${body.user} added`);
        res.send({text: `${body.user} added`, url: "/game"});
    }

    logged(user) {
        if (typeof user !== 'string' || user.length == 0)
            return false;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].is(user))
                return true;
        }
        return false;
    }

    // TODO create methods to change state

    status(user) {
        // console.log("Game status", user);
        const response = {
            state: this.state
        };
        switch (this.state) {
            case TheMind.PLAYING:
                response.cards = [2, 4, 8, 16, 32, 68]; // TODO generate cards
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

    indexOf(user) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].is(user))
                return i;
        }
        return -1;
    }

    sendCard(res, user) {
        // TODO check correct state
        const userIndex = this.indexOf(user);
        // TODO check valid user

        // TODO check player no cards
        

    }
}

module.exports = TheMind;
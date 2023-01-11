class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
    }

    is(user) {
        return this.name == user;
    }

    clearCards() {
        this.cards.length = 0;
    }

    addCard(card) {
        this.cards.push(card); // TODO add them sorted
    }

    removeCard() {
        // Return the first card
        return this.cards.shift();
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

    // Change state
    start() {
        if (this.state != TheMind.LOGIN)
            return;
        this.startRound();
    }

    endRound() {
        if (this.state != TheMind.PLAYING)
            return;
        this.state = TheMind.INTER;
        // TODO analyze round
    }

    startRound() {
        if (this.state != TheMind.INTER && this.state != TheMind.LOGIN)
            return;
        this.state = TheMind.PLAYING;
        this.level++;
        console.log("Round", this.level);
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].clearCards();
            for (let j = 0; j < this.level; j++) {
                this.players[i].addCard(Math.floor(Math.random() * 100)); // TODO generate cards
            }
        }
    }

    endGame() {
        // TODO
        this.state = TheMind.END;
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
        let userIndex = this.indexOf(user);
        switch (this.state) {
            case TheMind.PLAYING:
                response.cards = this.players[userIndex].cards;
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
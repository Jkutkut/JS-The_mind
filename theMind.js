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
        if (this.cards.length == 0)
            return -1;
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

        // Playing state
        this.remaining = -1;
        this.lastCard = -1;
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

        const generator = function *(min, max) {
            const arr = [];
            for (let i = min; i <= max; i++)
                arr.push(i);
            let i = arr.length;
            while (i)
                yield arr.splice(Math.floor(Math.random() * (i--)), 1)[0];
        };
        const cards = generator(1, 100);
        this.remaining = this.players.length * this.level;
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].clearCards();
            for (let j = 0; j < this.level; j++)
                this.players[i].addCard(cards.next().value);
        }
        this.lastCard = -1;
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
        let userIndex = this.indexOf(user);
        if (userIndex == -1)
            return {state: -1};
        const response = {
            state: this.state
        };
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
        // console.log("Send card", user);
        if (this.state != TheMind.PLAYING)
            return res.send({error: "Not on playing phase."});
        // console.log("Obtaining card", user);
        const userIndex = this.indexOf(user);
        if (userIndex == -1)
            return res.send({error: "User not found"});
        // console.log("User found:", user, userIndex);
        const card = this.players[userIndex].removeCard();
        if (card == -1)
            return res.send({error: "No cards left"});
        // TODO check valid card used
        this.remaining--;
        console.log(`${user} sent ${card}`);
        res.send("OK");
    }
}

module.exports = TheMind;
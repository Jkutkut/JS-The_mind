class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this._panic = false;
    }

    is(user) {
        return this.name == user;
    }

    clearCards() {
        this.cards.length = 0;
    }

    addCard(card) {
        const binarySearchAdd = (arr, x) => {
            let start = 0, end = arr.length;
            while (start < end) {
                let mid = Math.floor((start + end) / 2);
                if (arr[mid] < x) {
                    start = mid + 1;
                } else {
                    end = mid;
                }
            }
            arr.splice(start, 0, x);
            return arr;
        }
        this.cards = binarySearchAdd(this.cards, card);
    }

    removeCard() {
        if (this.cards.length == 0)
            return -1;
        // Return the first card
        return this.cards.shift();
    }

    get panic() {
        return this._panic;
    }

    doPanic() {
        this._panic = true;
    }

    dontPanic() {
        this._panic = false;
    }
}

class TheMind {
    static MAX_LEVEL = 15;

    static LOGIN = 0;
    static PLAYING = 1;
    static INTER = 2;
    static END = 3;

    constructor() {
        this.players = [];
        this.level = 0; // First lvl is 1
        this._state = TheMind.LOGIN;
        this.health = 3; // TODO change based on number of players
        this.panics = 2; // TODO change based on number of players
        this.playersInPanic = -1;

        // Playing state
        this.remaining = -1;
        this.allCards = [];

        // Inter state
        this.roundResult = "";

        console.log("The mind initialized");
    }

    // Root menu:
    rootStatus() {
        return {
            state: this.state,
            level: this.level,
            health: this.health,
            panics: this.panics,
            result: this.roundResult,
            players: this.players.map(p => { return { name: p.name, inPanic: p.panic, cards: p.cards } })
        };
    }

    addLive() {
        this.health++;
    }

    addPanic() {
        this.panics++;
    }

    start() {
        if (this.state != TheMind.LOGIN)
            return;
        this.startRound();
    }

    endRound(success, reason="") {
        if (this.state != TheMind.PLAYING)
            return;
        this.playersInPanic = -1;
        if (success) {
            this.roundResult = "Round " + this.level + " ended successfully";
            // TODO add health and panics
        }
        else {
            this.level--;
            this.health--;
            this.roundResult = reason;
        }
        if (this.health == 0 || this.level >= Math.min(TheMind.MAX_LEVEL, 100 / this.players.length))
            this.endGame();
        else
            this.state = TheMind.INTER;
    }

    startRound() {
        if (this.state != TheMind.INTER && this.state != TheMind.LOGIN)
            return;
        this.state = TheMind.PLAYING;
        this.level++;
        this.playersInPanic = 0;
        const generator = function *(min, max) {
            const arr = [];
            for (let i = min; i <= max; i++)
                arr.push(i);
            let i = arr.length;
            while (i)
                yield arr.splice(Math.floor(Math.random() * (i--)), 1)[0];
        };
        const cards = generator(1, 100);
        this.allCards.length = 0;
        this.remaining = this.players.length * this.level;
        let card;
        for (let i = 0, j; i < this.players.length; i++) {
            this.players[i].dontPanic();
            this.players[i].clearCards();
            for (j = 0; j < this.level; j++) {
                card = cards.next().value;
                this.players[i].addCard(card);
                this.allCards.push(card);
            }
        }
        this.allCards.sort((a, b) => b - a); // Smallest last
        console.log("Round", this.level, "started");
    }

    endGame() {
        this.state = TheMind.END;
    }

    // App:

    addPlayer(req, res) {
        if (this.state != TheMind.LOGIN)
            return res.send({error: "Not on login phase."});
        const body = req.body;
        if (this.logged(body.user))
            return res.send({error: "User already logged"});
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

    status(user) {
        let userIndex = this.indexOf(user);
        if (userIndex == -1)
            return {state: -1};
        const response = {
            state: this.state,
            health: this.health,
            panics: this.panics,
        };
        switch (this.state) {
            case TheMind.PLAYING:
                response.inPanic = this.players[userIndex].panic;
                response.cards = this.players[userIndex].cards;
                response.lastCard = -1;
                if (this.remaining < this.allCards.length)
                    response.lastCard = this.allCards[this.remaining];
                break;
            case TheMind.INTER:
                response.result = this.roundResult;
                break;
            case TheMind.END:
                response.result = `<h1>Game ended</h1>You managed to last until round ${this.level}`;
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
        if (this.state != TheMind.PLAYING)
            return res.send({error: "Not on playing phase."});
        const userIndex = this.indexOf(user);
        if (userIndex == -1)
            return res.send({error: "User not found"});
        const card = this.players[userIndex].removeCard();
        if (card == -1)
            return res.send({error: "No cards left"});
        if (this.allCards[this.remaining - 1] != card) {
            this.endRound(false, `${user} sent ${card} but the next one was ${this.allCards[this.remaining - 1]}`);
            return res.send({error: "Wrong card"});
        }
        this.remaining--;
        console.log(`${user} sent ${card}`);
        if (this.remaining == 0)
            this.endRound(true);
        res.send("OK");
    }

    panic(res, user) {
        if (this.state != TheMind.PLAYING)
            return res.send({error: "Not on playing phase."});
        const userIndex = this.indexOf(user);
        if (userIndex == -1)
            return res.send({error: "User not found"});
        this.players[userIndex].doPanic();
        this.playersInPanic++;
        console.log(`${user} panicked`);
        if (this.playersInPanic == this.players.length) {
            this.panics--;
            this.endRound(false, "All players panicked");
        }
        res.send("OK");
    }

    // GETTERS
    get state() {
        return this._state;
    }

    set state(newState) {
        const STATES = ['LOGGIN', 'PLAYING', 'INTER', 'ENDGAME'];
        console.log(`Changing state: ${STATES[this.state]} -> ${STATES[newState]}`);
        this._state = newState;
    }
}

module.exports = TheMind;
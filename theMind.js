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
}

class TheMind {
    static LOGIN = 0;
    static PLAYING = 1;
    static INTER = 2;
    static END = 3;

    constructor() {
        this.players = [];
        // this.level = 0; // First lvl is 1
        this.level = 5 // TODO
        this.state = TheMind.LOGIN;

        // Playing state
        this.remaining = -1;
        this.allCards = [];

        // Inter state
        this.roundResult = "";
    }

    // Change state
    start() {
        if (this.state != TheMind.LOGIN)
            return;
        this.startRound();
    }

    endRound(success, reason="") {
        if (this.state != TheMind.PLAYING)
            return;
        if (success) {
            this.roundResult = "Round " + this.level + " ended successfully";
            // TODO analyze round
        }
        else {
            this.level--;
            this.roundResult = reason;
        }
        this.state = TheMind.INTER;
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
        this.allCards.length = 0;
        this.remaining = this.players.length * this.level;
        let card;
        for (let i = 0, j; i < this.players.length; i++) {
            this.players[i].clearCards();
            for (j = 0; j < this.level; j++) {
                card = cards.next().value;
                this.players[i].addCard(card);
                this.allCards.push(card);
            }
        }
        this.allCards.sort((a, b) => b - a); // Smallest last
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
                response.result = this.roundResult;
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
        if (this.allCards[this.remaining - 1] != card) {
            this.endRound(false, `${user} sent ${card} but the next one was ${this.allCards[this.remaining - 1]}`);
            return res.send({error: "Wrong card"});
        }
        this.remaining--;
        if (this.remaining == 0)
            this.endRound(true);
        console.log(`${user} sent ${card}`);
        res.send("OK");
    }
}

module.exports = TheMind;
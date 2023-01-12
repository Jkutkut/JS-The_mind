// ********** Dependencies **********
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const TheMind = require('./theMind');
require('dotenv').config();

// **** Express ****
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// **** View engine setup ****
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

let game = new TheMind();
// ********** Routes **********
app.get(
    '/',
    (req, res) => {
        switch (game.state) {
            case TheMind.LOGIN:
                res.redirect('/login');
            case TheMind.PLAYING:
            case TheMind.INTER:
                res.redirect('/game');
            case TheMind.END:
                res.render('error', {message: "Xao pescao", error: {status: 0, stack: ""}});
        }
    }
);

app.get(
    '/root',
    (req, res) => {
        res.render('root');
    }
)

app.get(
    '/login',
    (req, res) => {
        if (game.state != TheMind.LOGIN)
            return res.render('error', {message: "Game has already started", error: {status: -42, stack: ""}});
        res.render("login");
    }
);

app.post(
    '/signup',
    (req, res) => {
        game.addPlayer(req, res);
    }
)


// Game
app.get(
    '/game',
    (req, res) => {
        const user = req.query.user;
        if (!game.logged(user))
            return res.redirect('/login'); // TODO show special message?
        res.render('game');
    }
);

app.get(
    '/game/status',
    (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(game.status(req.query.user)));
    }
)

app.post(
    '/sendCard',
    (req, res) => game.sendCard(res, req.query.user)
)

app.post(
    '/panic',
    (req, res) => game.panic(res, req.query.user)
)

// ! Root menu
app.get(
    '/rootStatus',
    (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(game.rootStatus()));
    }
);

app.get(
    '/debug/start',
    (req, res) => {
        game.start();
        res.send('OK');
    }
);
app.get(
    '/debug/startRound',
    (req, res) => {
        game.startRound();
        res.send('OK');
    }
);

app.get(
    '/debug/endRound',
    (req, res) => {
        game.endRound(false, "Stopped by root");
        res.send('OK');
    }
);
app.get(
    '/debug/endGame',
    (req, res) => {
        game.endGame();
        res.send('OK');
    }
);

app.get(
    '/debug/restartGame',
    (req, res) => {
        game = new TheMind();
    }
);

app.get(
    '/debug/extraLive',
    (req, res) => {
        game.addLive();
        res.send('OK');
    }
);

app.get(
    '/debug/extraPanic',
    (req, res) => {
        game.addPanic();
        res.send('OK');
    }
);

// **** Errors ****
// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// ********** Module **********
module.exports = app;
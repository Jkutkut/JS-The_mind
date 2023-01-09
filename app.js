// ********** Dependencies **********
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// **** Express ****
const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// **** View engine setup ****
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// ********** Routes **********
app.get(
    '/',
    (req, res) => res.redirect('/app')
);

app.get(
    '/app',
    (req, res) => {
        res.send("hello!");
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
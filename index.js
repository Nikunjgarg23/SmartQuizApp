const express = require('express');
const app = express();
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
//session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');


const MongoStore = require('connect-mongo')(session);

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
    name : 'quizzer',
    secret : 'None',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (60*1000*10)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || "connect-db ok");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes'));

app.listen("3000", () => {
    console.log(`server is running on port 3000`);
});
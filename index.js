const express = require('express');
const app = express();
const db = require('./config/mongoose');

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.urlencoded());
app.use(express.static('public'));



app.use('/',require('./routes'));

app.listen("3000", () => {
    console.log(`server is running on port 3000`);
});
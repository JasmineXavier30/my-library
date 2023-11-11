if(process.env.NODE_ENV !== "production")
    require('dotenv').config();

const express = require('express');
const layouts = require('express-ejs-layouts');
const app =  express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

app.use(methodOverride('_method'))

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;

db.on("error", (error) => console.log("Error while trying to connect!", error));
db.once("open", () => console.log("Connected to Mongoose!"))

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');
app.use(bodyParser.urlencoded({extended: false, limit: "100mb"}));

app.use(express.static('public'));
app.use(layouts)
app.use("/", require('./routes/index'));
app.use("/authors", require('./routes/authors'));
app.use('/books', require('./routes/books'))

app.listen(process.env.PORT || 3000);


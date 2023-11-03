if(process.env.NODE_ENV !== "production")
    require('dotenv').config();

const express = require('express');
const layouts = require('express-ejs-layouts');
const app =  express();
const indexRouter = require('./routes/index');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;

db.on("error", (error) => console.log("Error connecting!!!!", error));
db.once("open", () => console.log("Connected to Mongoose!"))

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');

app.use(express.static('public'));
app.use(layouts)
app.use("/", indexRouter)

app.listen(process.env.PORT || 3000);

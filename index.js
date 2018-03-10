const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/User");
require("./models/Member");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: 'twice voting app',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/membersRoutes")(app);

if(process.env.NODE_ENV === "production") {
    // Express will serve up production assets
    app.use(express.static("client/build"));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
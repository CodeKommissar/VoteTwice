const express = require("express");
const session = require('express-session');
const passport = require("passport");
const RedditStrategy = require("passport-reddit").Strategy;
const crypto = require("crypto");
const keys = require("./config/keys");

const app = express();

// Configure Express
app.use(session({
    secret: 'twice voting app',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

// Create Reddi Strategy
passport.use(new RedditStrategy({
    clientID: keys.redditClientID,
    clientSecret: keys.redditClientSecret,
    callbackURL: "/auth/reddit/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
}));

// Reddit Auth Routes
app.get("/auth/reddit", function(req,res, next){
    // The 'state' option is a Reddit-specific requirement.
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate("reddit", {
        state: req.session.state,
    })(req, res, next);
})

app.get('/auth/reddit/callback', function(req, res, next){
  // Check for origin via state token
  if (req.query.state == req.session.state){
    passport.authenticate('reddit', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  }
  else {
    next( new Error(403) );
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
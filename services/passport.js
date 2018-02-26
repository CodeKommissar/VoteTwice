const passport = require("passport");
const RedditStrategy = require("passport-reddit").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(new RedditStrategy({
    clientID: keys.redditClientID,
    clientSecret: keys.redditClientSecret,
    callbackURL: "/auth/reddit/callback",
    proxy: true
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ redditId: profile.id }).then((existingUser) => {
        if (existingUser) {
            // we already have a record with the given profile ID
            done(null, existingUser);
        } else {
            // we don't have a user record with this ID, make a new record
            new User({ redditId: profile.id })
                .save()
                .then(user => done(null, user));
        }
    })
}));

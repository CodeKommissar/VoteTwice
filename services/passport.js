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
}, async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ redditId: profile.id })

      if (existingUser) {
          // we already have a record with the given profile ID
          return done(null, existingUser);
      }

      // we don't have a user record with this ID, make a new record
      const user = await new User({ redditId: profile.id }).save();
      done(null, user);
  })
);

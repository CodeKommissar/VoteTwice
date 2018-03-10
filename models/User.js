const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    redditId: String,
    lastTimeVoted: { type: Date, default: 1 }
});

mongoose.model("users", userSchema);
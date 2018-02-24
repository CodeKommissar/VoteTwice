const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    redditId: String
});

mongoose.model("users", userSchema);
const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberSchema = new Schema({
    name: {type: String, required: true},
    picturePath: {type: String, required: true},
    id: {type: Number, required: true},
    votes: {type: Number, required: true},
});

module.exports = mongoose.model("Member", memberSchema);
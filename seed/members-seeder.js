const Member = require("../models/Member");
const mongoose = require("mongoose");
const keys = ("../config/keys.js");

mongoose.connect(keys.mongoURI);

var members = [
    new Member({
        name: "Tzuyu",
        picturePath: "https://i.imgur.com/tRHFSpd.jpg",
        id: 0,
        votes: 0
    }),
    new Member({
        name: "Chaeyoung",
        picturePath: "https://i.imgur.com/TjwCHgt.jpg",
        id: 1,
        votes: 0
    }),
    new Member({
        name: "Dahyun",
        picturePath: "https://i.imgur.com/y1ZMzEz.jpg",
        id: 2,
        votes: 0
    }),
    new Member({
        name: "Mina",
        picturePath: "https://i.imgur.com/jrowOL1.jpg",
        id: 3,
        votes: 0
    }),
    new Member({
        name: "Jihyo",
        picturePath: "https://i.imgur.com/rcG2S8p.jpg",
        id: 4,
        votes: 0
    }),
    new Member({
        name: "Sana",
        picturePath: "https://i.imgur.com/34VsXvK.jpg",
        id: 5,
        votes: 0
    }),
    new Member({
        name: "Momo",
        picturePath: "https://i.imgur.com/ycFHjLI.jpg",
        id: 6,
        votes: 0
    }),
    new Member({
        name: "Jeongyeon",
        picturePath: "https://i.imgur.com/bFc2ryl.jpg",
        id: 7,
        votes: 0
    }),
    new Member({
        name: "Nayeon",
        picturePath: "https://i.imgur.com/F4CvQ7Q.jpg",
        id: 8,
        votes: 0
    }),
];

var done = 0;
for (var i = 0; i < members.length; i++) {
    members[i].save(function(err, result) {
        done++;
        if (done === members.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}

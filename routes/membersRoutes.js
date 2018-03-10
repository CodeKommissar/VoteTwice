const mongoose = require("mongoose");

const requireLogin = require("../middlewares/requireLogin");
const Member = mongoose.model("Member");

module.exports = (app) => {
  app.get("/api/members", async (req, res) => {
    const allMembers = await Member.find({});
    res.send(allMembers);
  });

  app.put("/api/members", requireLogin, async (req, res) => {
    // The user must wait a minimum of 10 hours between each vote submission
    if(Date.now() - req.user.lastTimeVoted < (1000 * 60 * 60 * 10)) {
      return res.status(401).send({ 
        error: "You must wait 10 hours between each time you vote!" 
      });
    } else {
      // The user can vote, change last time he voted to the current time
      req.user.lastTimeVoted = Date.now();
      req.user.save();
      
      // Submit the votes made by the user to each individual member
      req.body.forEach(member => {
        Member.findById(member._id, function (err, memberDB) {
          memberDB.votes = memberDB.votes + member.extraVotes;
          memberDB.save();
        })
      })
    }
  });
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ["supervisor", "worker"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const Team = mongoose.model("Team", teamMemberSchema);
module.exports = Team;

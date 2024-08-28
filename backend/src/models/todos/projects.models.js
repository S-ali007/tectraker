const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeEntrySchema = new Schema(
  {
    user_id: { type: String, required: true },
    task_name: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    duration: { type: Number },
  },
  { timestamps: true }
);

const projectSchema = new Schema(
  {
    id: Number,
    name: String,
    billable: Boolean,
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admin_id: Number,
    stats: {
      worked_total: Number,
      worked_this_month: Number,
      worked_this_week: Number,
      worked_last_24_hours: Number,
      number_of_workers: Number,
    },
    abilities: [String],
    show_teammates: Boolean,
    last_activity_time: Date,
    last_activity: String,
    user_stats: {
      worked_today: Number,
      worked_total: Number,
    },
    created_at: Date,
    invoiced: Boolean,
    engagement_ids: [Number],
    pending: Boolean,
    archived_at: Date,
    isArchived: { type: Boolean, default: false },
    currency: String,
    pending_invitation_ids: [Number],
    invoicing_schedule: {
      schedule_type: String,
      period: String,
      day: Number,
    },
    budget: {
      amount: String,
      limited: Boolean,
      rate_type: String,
      used: Number,
    },
    current_user: {
      role: String,
      joined: Date,
      creator: Boolean,
    },
    tracking_requirements: Object,
    is_admin_client: Boolean,
    profiles_ids: [Number],
    admin_profile: {
      name: String,
      avatar_url: String,
      phone: String,
      email: String,
      address: String,
      id: Number,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    timeEntries: [timeEntrySchema],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;

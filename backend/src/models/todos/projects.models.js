const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeEntrySchema = new Schema(
  {
    user_id: { type: String, required: true },
    task_name: { type: String },
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    duration: { type: Number },
  },

  { timestamps: true }
);
const userAgentSchema = new Schema({
  client: { type: String, required: true },
  os_type: { type: String, required: true },
  browser_type: { type: String, required: true },
});

const activitySchema = new Schema({
  user_id: { type: String, required: true },
  task_name: { type: String },
  // offline: { type: Boolean, required: true },
  // offline_type: { type: String, required: true },
  // project_id: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  // abilities: [{ type: String, required: true }],
  // user_agent: { type: userAgentSchema, required: true },
  // changed_manually: { type: Boolean, required: true },
  invoice_custom_id: { type: mongoose.Schema.Types.Mixed },
  mouse_clicks: { type: Number, default: 0 },
  keyboard_hits: { type: Number, default: 0 },
  shot_ids: [{ type: mongoose.Schema.Types.Mixed }],
  screenshot_count: { type: Number, default: 0 },
  duration: { type: Number },
  // project_name: { type: String, required: true },
  last_shot: { type: mongoose.Schema.Types.Mixed },
  shots: [{ type: mongoose.Schema.Types.Mixed }],
});

const dateSchema = new Schema({
  date: { type: String, required: true },
  total: { type: Number, required: true },
  activities: [activitySchema],
});
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
    dates: [dateSchema],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;

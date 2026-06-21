const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // every job query filters by userId, so this speeds up that lookup
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    salary: {
      type: String, // kept as String since stipends vary in format ("₹80,000/month", "Unpaid", "$20/hr")
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    applicationLink: {
      type: String,
      trim: true,
    },
    applicationDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['ToApply', 'Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'ToApply',
    },
    notes: {
      type: String,
      trim: true,
    },
    // --- fields to support the Google Calendar "Add to Calendar" link feature ---
    interviewDate: {
      type: Date, // set when status moves to "Interview"; used to generate the calendar link
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);

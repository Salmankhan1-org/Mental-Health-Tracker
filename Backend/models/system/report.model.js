const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        against: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        reason: {
            type: String,
            enum: [
                'no_show',
                'late_join',
                'unprofessional_behavior',
                'technical_issue',
                'breach_of_confidentiality',
                'missed_appointment',
                'unprofessional_communication',
                'other'
            ],
            required: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        status: {
            type: String,
            enum: ['open', 'in_review', 'resolved', 'rejected'],
            default: 'open',
        },

        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
        },

        resolvedAt: {
            type: Date,
            default: null,
        },

        resolutionNote: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        handledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reports for same appointment by same user
reportSchema.index(
  { appointment: 1, reportedBy: 1 },
  { unique: true }
);

// Fast lookup per appointment
reportSchema.index({ appointment: 1 });

// For admin dashboards
reportSchema.index({ status: 1 });

// For user-specific reports
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ against: 1 });

// For sorting recent reports
reportSchema.index({ createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
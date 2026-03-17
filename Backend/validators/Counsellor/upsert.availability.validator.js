const { body } = require("express-validator");

const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Updated regex: Allows "9:00" or "09:00"
const timeRegex = /^([0-1]?\d|2[0-3]):([0-5]\d)$/;

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

exports.AvailabilityValidator = [
    body("timezone")
        .notEmpty()
        .withMessage("timezone is required")
        .isString(),

    body("payload")
    .isArray({ min: 1 })
    .withMessage("payload must be a non-empty array"),

    body("payload.*.dayOfWeek").isIn(validDays).withMessage("Invalid dayOfWeek"),

    body("payload.*.ranges").isArray({ min: 1 }).withMessage("At least one range required"),

    body("payload.*.ranges.*.startTime").matches(timeRegex).withMessage("startTime must be HH:mm (00:00 - 23:59)"),

    body("payload.*.ranges.*.endTime").matches(timeRegex).withMessage("endTime must be HH:mm (00:00 - 23:59)"),

    body("payload.*.ranges.*.duration").isInt({ min: 1 }).withMessage("duration must be positive"),

    // Custom logic for logical flow and overlap/duplicate detection
    body("payload.*.ranges").custom((ranges) => {
        const parsedRanges = [];

        for (const range of ranges) {
            const start = timeToMinutes(range.startTime);
            const end = timeToMinutes(range.endTime);

            if (start >= end) {
                throw new Error(`Invalid range: ${range.startTime} to ${range.endTime}. Start must be before end.`);
            }

            if (range.duration > (end - start)) {
                throw new Error(`Duration (${range.duration}m) exceeds range ${range.startTime}-${range.endTime}`);
            }

            parsedRanges.push({ start, end, original: `${range.startTime}-${range.endTime}` });
        }

        // Sort by start time to detect overlaps/duplicates efficiently
        parsedRanges.sort((a, b) => a.start - b.start);

        for (let i = 1; i < parsedRanges.length; i++) {
            const prev = parsedRanges[i - 1];
            const current = parsedRanges[i];

            // 1. Detect Exact Duplicates
            if (current.start === prev.start && current.end === prev.end) {
                throw new Error(`Duplicate time range detected: ${current.original}`);
            }

            // 2. Detect Overlaps (even by 1 minute)
            if (current.start < prev.end) {
                throw new Error(`Overlap detected between ${prev.original} and ${current.original}`);
            }
        }

        return true;
    }),
];
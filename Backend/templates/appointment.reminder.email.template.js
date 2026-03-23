const brandColor = "#10b981";
const reminderBg = "#eff6ff"; // soft blue

module.exports = function AppointmentReminderEmailTemplate(
  recipientName,
  otherPersonName,
  role, // 'student' | 'counsellor'
  details
) {
  const {
    date,
    startTime,
    endTime,
    meetingMethod,
    meetingLink,
    location,
    phoneNumber,
    reminderType, // '1h' | '10m'
  } = details;

  const meetingInfo =
    meetingMethod === "google-meet"
      ? `<a href="${meetingLink}" style="color:${brandColor}; font-weight:600; text-decoration:none;">Join Meeting</a>`
      : meetingMethod === "in-person"
      ? `<span><strong>Location:</strong> ${location}</span>`
      : `<span><strong>Phone:</strong> ${phoneNumber}</span>`;

  const introLine =
    role === "student"
      ? `You have an upcoming session with <strong>${otherPersonName}</strong>.`
      : `You have an upcoming session with <strong>${otherPersonName}</strong>.`;

  const urgencyText =
    reminderType === "10m"
      ? "Starting shortly"
      : "Coming up soon";

  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:30px 10px;">
            
            <table width="100%" style="max-width:520px; background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <tr>
                <td style="background:${brandColor}; padding:16px; text-align:center;">
                  <h2 style="margin:0; color:#ffffff; font-size:18px;">
                    ${urgencyText}
                  </h2>
                </td>
              </tr>

              <tr>
                <td style="padding:24px; color:#374151;">
                  
                  <p style="font-size:14px; margin-bottom:12px;">
                    Hi <strong>${recipientName}</strong>,
                  </p>

                  <p style="font-size:14px; margin-bottom:18px; line-height:1.6;">
                    ${introLine}
                  </p>

                  <div style="background:${reminderBg}; padding:16px; border-radius:6px; font-size:14px;">
                    <p style="margin:0 0 8px;"><strong>Date:</strong> ${date}</p>
                    <p style="margin:0 0 8px;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
                    <p style="margin:0 0 8px;"><strong>Mode:</strong> ${meetingMethod}</p>
                    <p style="margin:8px 0 0;">${meetingInfo}</p>
                  </div>

                  <p style="font-size:13px; margin-top:18px; color:#6b7280;">
                    Please be ready on time to ensure a smooth session.
                  </p>

                  ${
                    meetingMethod === "google-meet"
                      ? `
                      <div style="text-align:center; margin-top:20px;">
                        <a href="${meetingLink}" 
                          style="background:${brandColor}; color:#fff; padding:12px 20px; border-radius:6px; text-decoration:none; font-size:14px; font-weight:bold;">
                          Join Now
                        </a>
                      </div>
                    `
                      : ""
                  }

                  <p style="font-size:13px; margin-top:24px;">
                    — MindBridge Team
                  </p>

                </td>
              </tr>

              <tr>
                <td style="background:#f9fafb; padding:12px; text-align:center;">
                  <p style="font-size:11px; color:#9ca3af; margin:0;">
                    © ${new Date().getFullYear()} MindBridge Pvt Ltd
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
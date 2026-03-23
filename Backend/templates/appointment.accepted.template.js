const brandColor = "#10b981";
const neutralBg = "#f9fafb";
const successBg = "#ecfdf5"; // light green

module.exports = function AppointmentAcceptedEmailTemplate(
  studentName,
  counsellorName,
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
  } = details;

  const meetingInfo =
    meetingMethod === "google-meet"
      ? `<strong>Meeting Link:</strong> <a href="${meetingLink}" style="color:${brandColor}; text-decoration:none;">Join Session</a>`
      : meetingMethod === "in-person"
      ? `<strong>Location:</strong> ${location}`
      : `<strong>Phone:</strong> ${phoneNumber}`;

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Appointment Confirmed - MindBridge</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background:#059669; padding:22px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:20px; letter-spacing: 0.5px;">
                    Appointment Confirmed
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:30px; color:#374151;">
                  <p style="font-size:14px; margin:0 0 12px;">
                    Hello <strong>${studentName}</strong>,
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
                    Great news! Your appointment with <strong>${counsellorName}</strong> has been <strong>successfully confirmed</strong>.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td style="background:${successBg}; padding:20px; border-radius:6px; border-left: 4px solid ${brandColor};">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                          <tr>
                            <td style="padding-bottom:8px;"><strong>Date:</strong></td>
                            <td style="padding-bottom:8px; text-align:right;">${date}</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:8px;"><strong>Time:</strong></td>
                            <td style="padding-bottom:8px; text-align:right;">${startTime} - ${endTime}</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:8px;"><strong>Mode:</strong></td>
                            <td style="padding-bottom:8px; text-align:right;">${meetingMethod}</td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding-top:10px; color:#065f46;">
                              ${meetingInfo}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; line-height:1.6; margin-bottom:25px;">
                    Please make sure to join the session on time. If you have any issues or need to reschedule, feel free to visit your dashboard.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${process.env.FRONTEND_URL}/student/dashboard" 
                           style="background:${brandColor}; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:14px; display:inline-block;">
                          View Appointment
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; margin-top:30px;">
                    Take care,<br />
                    <strong style="color:#059669;">MindBridge Pvt Ltd Team</strong>
                  </p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

                  <p style="font-size:12px; color:#9ca3af; text-align:center;">
                    Need help? Contact our support team at support@mindbridge.com
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#f9fafb; padding:16px; text-align:center;">
                  <p style="margin:0; font-size:12px; color:#9ca3af;">
                    © ${new Date().getFullYear()} MindBridge Pvt. Ltd. All rights reserved
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
const brandColor = "#10b981"; 
const softBg = "#ecfdf5"; 

module.exports = function AppointmentRequestEmailTemplate(counsellorName, studentName, details) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>New Appointment Request</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background:${brandColor}; padding:22px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:22px; letter-spacing: 0.5px;">
                    New Booking Request
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:30px; color:#374151;">
                  <p style="font-size:14px; margin:0 0 12px;">
                    Hello <strong>${counsellorName}</strong>,
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
                    A student, <strong>${studentName}</strong>, has requested a counselling session with you on our platform. Please review the following details:
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td style="background:${softBg}; padding:20px; border-radius:6px; border-left: 4px solid ${brandColor};">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                          <tr>
                            <td style="padding-bottom:10px; color:#065f46;"><strong>📅 Date:</strong></td>
                            <td style="padding-bottom:10px; color:#374151; text-align:right;">${details.date}</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:10px; color:#065f46;"><strong>⏰ Time:</strong></td>
                            <td style="padding-bottom:10px; color:#374151; text-align:right;">${details.startTime} – ${details.endTime}</td>
                          </tr>
                          <tr>
                            <td style="color:#065f46;"><strong>🔗 Mode:</strong></td>
                            <td style="color:#374151; text-align:right; text-transform: uppercase; font-weight: bold; font-size:12px;">
                              <span style="background:#ffffff; padding:2px 8px; border-radius:4px; border:1px solid #d1fae5;">
                                ${details.meetingMethod.replace("-", " ")}
                              </span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td style="background:#fff7ed; padding:14px; border-radius:6px; border: 1px solid #fed7aa;">
                        <p style="margin:0; font-size:13px; color:#9a3412;">
                          ⚠️ <strong>Urgent:</strong> To ensure high availability, requests for today expire within <strong>15 minutes</strong> if not accepted.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; line-height:1.6; margin-bottom:25px;">
                    Please log in to your dashboard to accept or decline this request based on your availability.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${process.env.FRONTEND_URL}/counsellor/dashboard" 
                           style="background:${brandColor}; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:14px; display:inline-block;">
                          Review Request
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; margin-top:30px;">
                    Best regards,<br />
                    <strong style="color:#059669;">MindBridge Pvt Ltd Team</strong>
                  </p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

                  <p style="font-size:12px; color:#9ca3af;">
                    This is an automated email. Please do not reply directly to this message.
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
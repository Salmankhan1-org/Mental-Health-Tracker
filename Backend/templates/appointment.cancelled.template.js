const brandColor = "#10b981"; 
const neutralBg = "#f9fafb";
const alertBg = "#fef2f2"; // Light red tint for cancellation

module.exports = function AppointmentCancelledEmailTemplate(studentName, counsellorName, details) {
  // Determine the display reason
  const reasonMessage = details.reason || "The request was not confirmed within the required timeframe.";
  const cancelledByLabel = details.cancelledBy === 'system' ? "System Auto-Expiry" : "Counsellor";

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Appointment Update - MindBridge</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background:#374151; padding:22px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:20px; letter-spacing: 0.5px;">
                    Appointment Update
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:30px; color:#374151;">
                  <p style="font-size:14px; margin:0 0 12px;">
                    Hello <strong>${studentName}</strong>,
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
                    We are writing to inform you that your appointment request with <strong>${counsellorName}</strong> has been <strong>cancelled</strong>.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td style="background:${alertBg}; padding:20px; border-radius:6px; border-left: 4px solid #ef4444;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                          <tr>
                            <td style="padding-bottom:8px; color:#991b1b;"><strong>Reason:</strong></td>
                            <td style="padding-bottom:8px; color:#374151; text-align:right;">${reasonMessage}</td>
                          </tr>
                          <tr>
                            <td style="color:#991b1b;"><strong>Cancelled By:</strong></td>
                            <td style="color:#374151; text-align:right;">${cancelledByLabel}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; line-height:1.6; margin-bottom:25px;">
                    Don't worry—your mental wellness is a priority. You can easily book another slot with <strong>${counsellorName}</strong> or explore other available counsellors on our platform who might have immediate availability.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${process.env.FRONTEND_URL}/student/counselors" 
                           style="background:${brandColor}; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:14px; display:inline-block;">
                          Find Another Counsellor
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; margin-top:30px;">
                    Best regards,<br />
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
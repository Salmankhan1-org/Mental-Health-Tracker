const brandColor = "#10b981";
const neutralBg = "#f9fafb";
const accentBg = "#ecfdf5";

module.exports = function AppointmentCompletionConfirmationTemplate(
  studentName,
  counsellorName,
  appointmentDate,
  details
) {
  const formattedDate = new Date(appointmentDate).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const meetingInfo =
    details.meetingMethod === "google-meet"
      ? `<p style="margin:6px 0;"><strong>Meeting Link:</strong> ${details.meetingLink}</p>`
      : details.meetingMethod === "in-person"
      ? `<p style="margin:6px 0;"><strong>Location:</strong> ${details.location}</p>`
      : `<p style="margin:6px 0;"><strong>Phone:</strong> ${details.phoneNumber}</p>`;

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Session Completion Confirmation</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background:#374151; padding:20px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:20px;">
                    Session Completed?
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#374151;">

                  <p style="font-size:14px; margin-bottom:12px;">
                    Hello <strong>${studentName}</strong>,
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin-bottom:16px;">
                    Your recent session with <strong>${counsellorName}</strong> has been marked as <strong>completed</strong> by the counsellor.
                  </p>

                  <!-- Appointment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td style="background:${accentBg}; padding:18px; border-radius:6px; border-left:4px solid ${brandColor};">
                        <p style="margin:6px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
                        <p style="margin:6px 0;"><strong>Mode:</strong> ${details.meetingMethod}</p>
                        ${meetingInfo}
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; margin-bottom:20px;">
                    Please confirm whether your session was successfully completed.
                  </p>

                  <!-- Action Buttons -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding-top:10px;">
                            <table cellpadding="0" cellspacing="0">
                            <tr>
                                
                                <!-- Confirm Button -->
                                <td align="center" style="padding-right:10px;">
                                <a href="${process.env.FRONTEND_URL}/appointments/confirm?token=${details.appointmentToken}" 
                                    style="background:${brandColor}; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:14px; font-weight:bold; display:inline-block;">
                                    Yes, It Was Completed
                                </a>
                                </td>

                                <!-- Report Button -->
                                <td align="center">
                                <a href="${process.env.FRONTEND_URL}/appointments/report?token=${details.appointmentToken}" 
                                    style="background:#ef4444; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:14px; font-weight:bold; display:inline-block;">
                                    Report an Issue
                                </a>
                                </td>

                            </tr>
                            </table>
                        </td>
                        </tr>
                  </table>

                  <p style="font-size:12px; color:#6b7280; margin-top:20px; text-align:center;">
                    If no action is taken, the session will be automatically marked as completed.
                  </p>

                  <p style="font-size:14px; margin-top:25px;">
                    Best regards,<br />
                    <strong style="color:#059669;">MindBridge Team</strong>
                  </p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

                  <p style="font-size:12px; color:#9ca3af; text-align:center;">
                    Need help? Contact support@mindbridge.com
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:${neutralBg}; padding:16px; text-align:center;">
                  <p style="margin:0; font-size:12px; color:#9ca3af;">
                    © ${new Date().getFullYear()} MindBridge Pvt. Ltd.
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
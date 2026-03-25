const brandColor = "#10b981";
const neutralBg = "#f9fafb";

module.exports = function UserStatusUpdateEmailTemplate(userName, status, details = {}) {
  const statusMap = {
    active: {
      label: "Activated",
      color: "#10b981",
      bg: "#ecfdf5",
      message: "Your account is now active and you can continue using MindBridge without any restrictions.",
    },
    inactive: {
      label: "Deactivated",
      color: "#6b7280",
      bg: "#f3f4f6",
      message: "Your account has been temporarily set to inactive. Some features may not be accessible.",
    },
    suspended: {
      label: "Suspended",
      color: "#ef4444",
      bg: "#fef2f2",
      message: "Your account has been suspended due to a policy or guideline violation.",
    },
  };

  const current = statusMap[status] || statusMap.inactive;

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Account Status Update - MindBridge</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background:#374151; padding:22px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:20px; letter-spacing:0.5px;">
                    Account Status Update
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:30px; color:#374151;">
                  <p style="font-size:14px; margin:0 0 12px;">
                    Hello <strong>${userName}</strong>,
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
                    We would like to inform you that your account status has been updated.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td style="background:${current.bg}; padding:20px; border-radius:6px; border-left: 4px solid ${current.color};">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                          <tr>
                            <td style="padding-bottom:8px;"><strong>Status:</strong></td>
                            <td style="padding-bottom:8px; text-align:right; color:${current.color}; font-weight:bold;">
                              ${current.label}
                            </td>
                          </tr>
                          ${
                            details.reason
                              ? `
                              <tr>
                                <td><strong>Reason:</strong></td>
                                <td style="text-align:right;">${details.reason}</td>
                              </tr>
                              `
                              : ''
                          }
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; line-height:1.6; margin-bottom:25px;">
                    ${current.message}
                  </p>

                  ${
                    status === "active"
                      ? `
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="${process.env.FRONTEND_URL}/student/dashboard" 
                               style="background:${brandColor}; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:14px; display:inline-block;">
                              Go to Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                      `
                      : ''
                  }

                  <p style="font-size:14px; margin-top:30px;">
                    If you have any questions or believe this was done in error, please contact our support team.
                  </p>

                  <p style="font-size:14px;">
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
                <td style="background:${neutralBg}; padding:16px; text-align:center;">
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
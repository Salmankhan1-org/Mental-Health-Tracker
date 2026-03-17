module.exports = function counsellorApplicationEmailTemplate( name ) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Counsellor Application Received</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#10b981; padding:22px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:22px;">
                    Application Received
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#374151;">
                  <p style="font-size:14px; margin:0 0 12px;">
                    Hello <strong>${name}</strong>,
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
                    Thank you for showing interest in becoming a <strong>counsellor</strong> on our platform.
                    Your application has been successfully submitted and is now under review.
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
                    Our team will carefully evaluate your details, qualifications, and expertise
                    to ensure the best experience for students seeking guidance.
                  </p>

                  <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td style="background:#ecfdf5; padding:14px; border-radius:6px;">
                        <p style="margin:0; font-size:13px; color:#065f46;">
                          ⏳ Please allow some time while we review your application.
                          You will receive another notification once the review process is complete.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; line-height:1.6;">
                    We appreciate your willingness to support and guide students in improving
                    their mental well-being. Your contribution can make a meaningful impact.
                  </p>

                  <p style="font-size:14px; margin-top:20px;">
                    Best regards,<br />
                    <strong style="color:#059669;">MindBridge Pvt Ltd Team</strong>
                  </p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

                  <p style="font-size:12px; color:#9ca3af;">
                    This is an automated email. Please do not reply to this message.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
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
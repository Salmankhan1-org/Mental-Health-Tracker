exports.AdminMessageEmailTemplate = ({
  userName,
  adminName,
  subject,
  message,
  category = 'general'
}) => {
  const brandColor = '#0f766e'; // teal (your theme)
  const isWarning = category === 'warning';

  return `
  <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:20px;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
      
      <!-- Header -->
      <tr>
        <td style="background:${brandColor}; padding:16px 24px; color:#ffffff;">
          <h2 style="margin:0; font-size:18px;">MindBridge</h2>
          <p style="margin:4px 0 0; font-size:12px; opacity:0.9;">
            A message from our support team
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:24px;">
          
          <p style="font-size:14px; color:#111827;">
            Hi <strong>${userName}</strong>,
          </p>

          <p style="font-size:14px; color:#374151; line-height:1.6;">
            You have received a message from the MindBridge team.
          </p>

          <!-- Category Badge -->
          ${
            isWarning
              ? `<div style="margin:16px 0; padding:10px 12px; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; font-size:12px; color:#991b1b;">
                  ⚠️ This message is marked as an important notice.
                </div>`
              : ''
          }

          <!-- Subject -->
          <div style="margin:20px 0;">
            <p style="font-size:12px; color:#6b7280; margin-bottom:4px;">Subject</p>
            <p style="font-size:14px; font-weight:bold; color:#111827;">
              ${subject}
            </p>
          </div>

          <!-- Message Box -->
          <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:16px; margin-top:10px;">
            <p style="font-size:14px; color:#374151; line-height:1.6; margin:0;">
              ${message}
            </p>
          </div>

          <!-- Footer Note -->
          <p style="font-size:12px; color:#6b7280; margin-top:20px; line-height:1.5;">
            If you have any questions or need assistance, feel free to reply to this email or contact our support team.
          </p>

          <p style="font-size:14px; color:#111827; margin-top:20px;">
            Regards,<br/>
            <strong>${adminName}</strong><br/>
            MindBridge Team
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb; padding:16px; text-align:center; font-size:11px; color:#9ca3af;">
          © ${new Date().getFullYear()} MindBridge. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
};
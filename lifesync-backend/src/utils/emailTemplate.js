/**
 * Generate the HTML email template for password reset OTP delivery.
 * Matches the LifeSync premium brand aesthetic.
 * 
 * @param {string} otp - 6-digit OTP code
 * @param {Object} details - Security details (ip, os, browser, date)
 * @returns {string} HTML string
 */
const getOtpEmailTemplate = (otp, details = {}) => {
  const {
    ip = 'Unknown IP',
    os = 'Unknown Device',
    browser = 'LifeSync App',
    date = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC'
  } = details;

  // Split OTP into characters to render in individual rounded boxes
  const digits = String(otp).split('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your LifeSync Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .header {
      padding: 32px 32px 20px 32px;
      text-align: center;
    }
    .logo-container {
      display: inline-block;
      margin-bottom: 16px;
    }
    .logo-hexagon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #9900ff, #c084fc);
      margin: 0 auto;
      position: relative;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-inner {
      font-family: 'Outfit', sans-serif;
      color: #ffffff;
      font-weight: bold;
      font-size: 20px;
    }
    .brand-name {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-top: 8px;
    }
    .content {
      padding: 0 32px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }
    p.intro {
      font-size: 15px;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .otp-table {
      margin: 0 auto 24px auto;
      border-collapse: separate;
      border-spacing: 8px;
    }
    .otp-box {
      width: 46px;
      height: 56px;
      background-color: #f5f3ff;
      border: 2px solid #ddd6fe;
      border-radius: 12px;
      font-size: 24px;
      font-weight: 700;
      color: #9900ff;
      text-align: center;
      line-height: 56px;
    }
    .caution-card {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 16px;
      padding: 20px;
      margin: 32px 0;
      text-align: left;
    }
    .caution-header {
      font-size: 14px;
      font-weight: 600;
      color: #b45309;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
    }
    .caution-text {
      font-size: 13px;
      color: #d97706;
      line-height: 1.5;
      margin: 0 0 16px 0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      color: #78350f;
    }
    .details-table td {
      padding: 4px 0;
    }
    .details-table td.label {
      font-weight: 600;
      width: 90px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 16px 0;
    }
    .social-links {
      margin-bottom: 16px;
    }
    .social-icon {
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 50%;
      background-color: #e2e8f0;
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
      font-weight: bold;
      margin: 0 6px;
    }
    .support-link {
      color: #9900ff;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-container">
          <div class="logo-hexagon">
            <span class="logo-inner">LS</span>
          </div>
          <div class="brand-name">LifeSync AI</div>
        </div>
      </div>

      <!-- Content -->
      <div class="content">
        <h1>Your Reset Verification Code</h1>
        <p class="intro">
          Please use the following 6-digit verification code to complete your password reset request. This code is valid for 10 minutes.
        </p>

        <!-- OTP Grid -->
        <table class="otp-table">
          <tr>
            ${digits.map(digit => `<td class="otp-box">${digit}</td>`).join('')}
          </tr>
        </table>

        <!-- Caution Warning Card -->
        <div class="caution-card">
          <div class="caution-header">
            ⚠️ Security Caution
          </div>
          <p class="caution-text">
            If you did not initiate this request, someone may be trying to access your account. Please change your password immediately.
          </p>
          <table class="details-table">
            <tr>
              <td class="label">Operating System</td>
              <td>${os}</td>
            </tr>
            <tr>
              <td class="label">Browser / Client</td>
              <td>${browser}</td>
            </tr>
            <tr>
              <td class="label">Date & Time</td>
              <td>${date}</td>
            </tr>
            <tr>
              <td class="label">IP Address</td>
              <td>${ip}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="social-links">
          <a href="#" class="social-icon">tw</a>
          <a href="#" class="social-icon">fb</a>
          <a href="#" class="social-icon">li</a>
        </div>
        <p class="footer-text">
          LifeSync AI Platform &bull; Smart Personal Finance & Life Management<br>
          Need help? Contact <a href="mailto:support@lifesync.ai" class="support-link">support@lifesync.ai</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

module.exports = { getOtpEmailTemplate };

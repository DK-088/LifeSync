/**
 * Generate the HTML email template for password reset OTP delivery.
 * Clean, modern layout matching the requested design exactly.
 * 
 * @param {string} otp - 6-digit OTP code
 * @param {Object} details - Security details
 * @returns {string} HTML string
 */
const getOtpEmailTemplate = (otp, details = {}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your LifeSync password reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f5f8;
      color: #1a1a1a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f5f8;
      padding: 40px 0;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      border: 1px solid #eef0f3;
      padding: 48px 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo-img {
      height: 36px;
      vertical-align: middle;
    }
    .brand-name {
      display: inline-block;
      font-size: 26px;
      font-weight: 700;
      color: #000000;
      margin-left: 8px;
      vertical-align: middle;
      letter-spacing: -0.5px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .content {
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px 0;
      letter-spacing: -0.3px;
    }
    p.intro {
      font-size: 14.5px;
      color: #4b5563;
      line-height: 1.6;
      margin: 0 auto 32px auto;
      max-width: 460px;
    }
    .otp-card {
      background-color: #f3f4f6;
      border-radius: 16px;
      padding: 24px;
      margin: 32px 0;
      text-align: center;
    }
    .otp-text {
      font-size: 38px;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: 8px;
      /* Offset letter-spacing on the last character for true centering */
      margin-right: -8px; 
    }
    p.disclaimer {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
      margin: 32px 0 0 0;
      max-width: 480px;
      display: inline-block;
    }
    .divider {
      border-top: 1px solid #e5e7eb;
      margin: 32px 0 24px 0;
    }
    .footer-desc {
      font-size: 12.5px;
      color: #6b7280;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .social-links {
      margin-bottom: 20px;
    }
    .social-link {
      display: inline-block;
      margin: 0 8px;
      color: #6b7280;
      text-decoration: none;
    }
    .social-link svg {
      width: 20px;
      height: 20px;
      opacity: 0.6;
      vertical-align: middle;
    }
    .social-link:hover svg {
      opacity: 1;
    }
    .copyright {
      font-size: 11.5px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header with Logo next to Brand Name -->
      <div class="header">
        <img src="cid:lifesynclogo" alt="LifeSync Logo" class="logo-img" />
        <span class="brand-name">LifeSync</span>
      </div>

      <!-- Main Body -->
      <div class="content">
        <h1>Verify your LifeSync password reset</h1>
        <p class="intro">
          We have received a password reset attempt with the following code. Please enter it in the app window where you started resetting your password.
        </p>

        <!-- OTP Grey Card -->
        <div class="otp-card">
          <div class="otp-text">${otp}</div>
        </div>

        <p class="disclaimer">
          If you did not attempt to reset your password but received this email, please disregard it. The code will remain active for 10 minutes.
        </p>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Footer -->
      <div class="content">
        <p class="footer-desc">
          LifeSync, an effortless personal finance & life management solution with all the features you need.
        </p>
        
        <!-- Social Icons (styled SVG paths for high resolution and cross-platform compatibility) -->
        <div class="social-links">
          <!-- Discord -->
          <a href="#" class="social-link">
            <svg style="fill:#6b7280;" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
            </svg>
          </a>
          
          <!-- GitHub -->
          <a href="#" class="social-link">
            <svg style="fill:#6b7280;" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>

          <!-- Twitter -->
          <a href="#" class="social-link">
            <svg style="fill:#6b7280;" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>

          <!-- Email -->
          <a href="mailto:support@lifesync.ai" class="social-link">
            <svg style="fill:#6b7280;" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>

        <p class="copyright">
          &copy; 2026 LifeSync. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

module.exports = { getOtpEmailTemplate };

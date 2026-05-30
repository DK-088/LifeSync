const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const env = require('../../config/env');

// Retrieve SMTP settings from central config
const smtpConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
};

const FROM_EMAIL = env.FROM_EMAIL;
const FROM_NAME = env.FROM_NAME;

let transporter = null;

/**
 * Get or initialize the Nodemailer transporter.
 * Supports standard SMTP config and dynamically generated Ethereal test accounts.
 */
const getTransporter = async () => {
  if (transporter) return transporter;

  // Use configured SMTP if variables are present
  if (smtpConfig.host && smtpConfig.auth.user && smtpConfig.auth.pass) {
    logger.info(`[EMAIL] Initializing SMTP transporter with host: ${smtpConfig.host}`);
    transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465, // true for 465, false for other ports
      auth: smtpConfig.auth,
    });
    return transporter;
  }

  // Development/Test Fallback: Ethereal Email
  logger.info('[EMAIL] SMTP config not detected. Initializing Ethereal email test account...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    logger.info(`[EMAIL] Ethereal test account created successfully: ${testAccount.user}`);
    return transporter;
  } catch (error) {
    logger.error(`[EMAIL] Failed to create Ethereal test account: ${error.message}. Email sending will run in console-only mode.`);
    return null;
  }
};

/**
 * Send an email using Nodemailer.
 * 
 * @param {Object} options - Email parameters
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 */
const sendEmail = async (options) => {
  const { to, subject, html, text } = options;

  logger.info(`[EMAIL] Dispatching email to: ${to} | Subject: ${subject}`);

  // Also print a terminal log of the OTP code and details for developer convenience
  console.log('\n=================== [EMAIL OUTBOX] ===================');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  if (text) console.log(`Text Body: ${text}`);
  console.log('======================================================\n');

  try {
    const mailClient = await getTransporter();

    if (!mailClient) {
      logger.warn('[EMAIL] Transporter unavailable. Email printed to console logs above.');
      return { success: true, consoleOnly: true };
    }

    const attachments = [];
    const logoPath = path.join(__dirname, '../../../../lifesync-mobile/assets/LifeSync_logo.png');
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: 'LifeSync_logo.png',
        path: logoPath,
        cid: 'lifesynclogo',
      });
    }

    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      text: text || 'LifeSync verification code request',
      html,
      attachments,
    };

    const info = await mailClient.sendMail(mailOptions);
    logger.info(`[EMAIL] Email successfully sent. MessageId: ${info.messageId}`);

    // If using Ethereal, generate and log a preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`[EMAIL] Preview Ethereal Email URL: ${previewUrl}`);
      return { success: true, previewUrl };
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`[EMAIL] Delivery failed: ${error.message}`);
    // Do not throw in development if email sending fails, allow developer to read console log
    if (process.env.NODE_ENV === 'development' || !smtpConfig.host) {
      logger.info('[EMAIL] Bypassing delivery error in development. Proceeding with console log reference.');
      return { success: true, consoleOnly: true };
    }
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = { sendEmail };

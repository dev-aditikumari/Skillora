const nodemailer = require("nodemailer");

const isMailConfigured = () =>
  Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS);

let transporter;
const getTransporter = () => {
  if (!transporter) {
    const port = Number(process.env.MAIL_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

// Sends an email. Throws on failure so callers decide whether it is fatal.
// In development without SMTP credentials the mail is logged instead, so
// signup and password reset stay testable locally.
const mailSender = async (email, title, body) => {
  if (!isMailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Mail service is not configured (MAIL_HOST, MAIL_USER, MAIL_PASS)");
    }
    console.log(`\n[mail:dev] To: ${email}\n[mail:dev] Subject: ${title}\n[mail:dev] ${body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}\n`);
    return { dev: true };
  }

  return getTransporter().sendMail({
    from: `"Skillora" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
    to: email,
    subject: title,
    html: body,
  });
};

mailSender.isMailConfigured = isMailConfigured;
module.exports = mailSender;

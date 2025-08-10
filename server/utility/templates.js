const { baseUrl } = require("../constants/constants");
const generateJoinEmail = (data) => {
  const { fullName, email, packageName } = data;
  const subject = "Join DevKofi Mentorship Programme";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #000;">Hi ${fullName},</h2>
      <p>Thank you for joining <strong>DevKofi</strong> with the <strong>${packageName}</strong> package. I’m excited to have you on board as you take this step toward building real-world apps and leveling up your skills.</p>
      <p>Your chosen package: <strong>${packageName}</strong></p>
      <p>We’ll be reaching out shortly—within the next <strong>2 business days</strong>—with all the details you need to get started with your <strong>${packageName}</strong> package:</p>
      <ul>
        <li><strong>Onboarding Information</strong>: Access to your dashboard, session schedule, and community links.</li>
        <li><strong>Next Steps</strong>: How to prepare for your first session and what to expect in the coming weeks.</li>
      </ul>
      <p>In the meantime, if you have any questions or want to share a little about your goals, feel free to reply to this email.</p>
      <p>Welcome again to the DevKofi community. We can’t wait to help you escape tutorial hell and start shipping things that matter.</p>
      <p style="margin-top: 2em;">Talk soon,<br>
      Kofi<br>
      Founder, DevKofi<br>
      <a href="https://devkofi.com" style="color: #2196F3; text-decoration: none;">https://devkofi.com</a></p>
    </div>
  `;

  const text = `
Hi ${fullName},

Thank you for joining DevKofi with the ${packageName} package. I’m excited to have you on board as you take this step toward building real-world apps and leveling up your skills.

Your chosen package: ${packageName}

We’ll be reaching out shortly—within the next 2 business days—with all the details you need to get started with your ${packageName} package:

- Onboarding Information: Access to your dashboard, session schedule, and community links.
- Next Steps: How to prepare for your first session and what to expect in the coming weeks.

In the meantime, if you have any questions or want to share a little about your goals, feel free to reply to this email.

Welcome again to the DevKofi community. We can’t wait to help you escape tutorial hell and start shipping things that matter.

Talk soon,
Kofi
Founder, DevKofi
https://devkofi.com
  `;

  return { subject, html, text };
};

const generateNewSubscriptionEmail = (email) => {
  const subject = `New Subscription: ${email}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h3 style="color: #000; margin-bottom: 1em;">New Subscriber Details</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p style="margin-top: 1.5em;">DevKofi Mentorship Notification</p>
      <a href="https://devkofi.com" style="color: #2196F3; text-decoration: none;">devkofi.com</a>
    </div>
  `;

  return { subject, html };
};

const generateNewsLetterSubscriptionEmail = (email) => {
  const subject = `Thank You for Joining Our Newsletter`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Welcome to DevKofi Mentorship</h2>
      <p>Thank you for subscribing to our newsletter, ${email}.</p>
      <p>You will now receive updates, tips, and exclusive content directly in your inbox.</p>
      <p>Visit us anytime at devkofi.com</p>
    </div>
  `;

  return { subject, html };
};

const generateAdminNotificationEmail = (data) => {
  const { fullName, email, phone, packageName } = data;
  const subject = `New DevKofi Mentorship Signup: ${fullName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #000;">New Signup Alert 🚀</h2>
      <p><strong>${fullName}</strong> has just joined the <strong>DevKofi Mentorship Programme</strong> with the <strong>${packageName}</strong> package.</p>
      <p><strong>Package Name:</strong> ${packageName}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2196F3;">${email}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${phone}" style="color: #2196F3;">${phone}</a></p>
      <p style="margin-top: 1.5em;">Be sure to follow up within the next <strong>2 business days</strong> with onboarding details for the <strong>${packageName}</strong> package.</p>
      <p style="margin-top: 2em;">— DevKofi System Notification</p>
    </div>
  `;

  const text = `
New Signup Alert 🚀

${fullName} has just joined the DevKofi Mentorship Programme with the ${packageName} package.

Package Name: ${packageName}
Email: ${email}
Phone: ${phone}

Be sure to follow up within the next 2 business days with onboarding details for the ${packageName} package.

— DevKofi System Notification
  `;

  return { subject, html, text };
};

const generateVerifyUserEmail = (data) => {
  const { fullName, token } = data;
  const subject = `Verify Your DevKofi Account, ${fullName}`;

  // const verificationLink = `https://devkofi.com/api/auth/verify?token=${token}`;
  const verificationLink =
    process.env.NODE_ENV === "production"
      ? `${baseUrl}/api/auth/verify?token=${token}`
      : `http://localhost:5000/api/auth/verify?token=${token}`;

  const html = `
    <h2>Welcome to DevKofi</h2>
    <p>Hi ${fullName},</p>
    <p>Thanks for signing up! Please verify your email address to activate your DevKofi account.</p>
    <p><a href="${verificationLink}">Verify My Account</a></p>
    <p>If the link doesn’t work, copy and paste this URL into your browser:</p>
    <p>${verificationLink}</p>
    <p>— The DevKofi Team</p>
  `;

  const text = `
Welcome to DevKofi

Hi ${fullName},

Thanks for signing up! Please verify your email address to activate your DevKofi account.

Click the link below to verify:
${verificationLink}

— The DevKofi Team
  `;

  return { subject, html, text, verificationLink };
};

const generateContactThankYouEmail = (data) => {
  const { fullName, email } = data;
  const subject = `Thanks for Contacting Us, ${fullName}!`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #000;">Thank You for Contacting Us!</h2>
      <p>Hi <strong>${fullName}</strong>,</p>
      <p>We’ve received your message sent from <a href="mailto:${email}" style="color: #2196F3;">${email}</a> and our team is reviewing it. You can expect a response within <strong>2 business days</strong>.</p>
      <p>We appreciate your patience and look forward to assisting you soon.</p>
      <p style="margin-top: 2em;">— DevKofi Support Team</p>
    </div>
  `;

  const text = `
Thank You for Contacting Us!

Hi ${fullName},

We’ve received your message sent from ${email} and our team is reviewing it. You can expect a response within 2 business days.

We appreciate your patience and look forward to assisting you soon.

— DevKofi Support Team
  `;

  return { subject, html, text };
};

const generateAdminContactNotificationEmail = (data) => {
  const { fullName, email, message } = data;
  const subject = `📩 New Contact Message from ${fullName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #000;">New Contact Message Received</h2>
      <p><strong>${fullName}</strong> has submitted a new contact request.</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2196F3;">${email}</a></p>
      <p><strong>Message:</strong></p>
      <blockquote style="margin: 1em 0; padding: 0.5em 1em; background: #f9f9f9; border-left: 4px solid #2196F3;">
        ${message}
      </blockquote>
      <p style="margin-top: 1.5em;">Please review and respond within <strong>2 business days</strong>.</p>
      <p style="margin-top: 2em;">— DevKofi System Notification</p>
    </div>
  `;

  const text = `
New Contact Message Received

${fullName} has submitted a new contact request.

Email: ${email}

Message:
"${message}"

Please review and respond within 2 business days.

— DevKofi System Notification
  `;

  return { subject, html, text };
};

module.exports = {
  generateNewSubscriptionEmail,
  generateNewsLetterSubscriptionEmail,
  generateJoinEmail,
  generateAdminNotificationEmail,
  generateVerifyUserEmail,
  generateContactThankYouEmail,
  generateAdminContactNotificationEmail,
};

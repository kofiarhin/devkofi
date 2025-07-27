const welcomeEmail = (data) => {
  const { name, email } = data;
  const subject = "Join DevKofi Mentorship Programme";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #000;">Hi ${name},</h2>
      <p>Thank you for joining <strong>DevKofi</strong>. I’m excited to have you on board as you take this step toward building real-world apps and leveling up your skills.</p>
      <p>We’ll be reaching out shortly—within the next <strong>2 business days</strong>—with all the details you need to get started:</p>
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
Hi ${name},

Thank you for joining DevKofi. I’m excited to have you on board as you take this step toward building real-world apps and leveling up your skills.

We’ll be reaching out shortly—within the next 2 business days—with all the details you need to get started:

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

module.exports = {
  welcomeEmail,
  generateNewSubscriptionEmail,
  generateNewsLetterSubscriptionEmail,
};

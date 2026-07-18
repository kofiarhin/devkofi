jest.mock("axios", () => ({ post: jest.fn() }));

const axios = require("axios");
const {
  TELEGRAM_TIMEOUT_MS,
  buildBookingNotification,
  buildContactNotification,
  escapeHtml,
  sendTelegramNotification,
} = require("../utils/telegramService");

describe("telegramService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    delete process.env.TELEGRAM_NOTIFICATIONS_ENABLED;
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
    process.env = originalEnv;
  });

  it("escapes Telegram HTML-sensitive user content", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'test'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;test&#39;"
    );
  });

  it("builds a contact notification with escaped values", () => {
    const text = buildContactNotification({
      _id: "contact-123",
      name: "Kofi <Admin>",
      email: "kofi@example.com",
      subject: "Help & support",
      message: "Use <strong>care</strong>",
      createdAt: new Date("2026-07-18T12:00:00.000Z"),
    });

    expect(text).toContain("New DevKofi Contact Message");
    expect(text).toContain("Kofi &lt;Admin&gt;");
    expect(text).toContain("Help &amp; support");
    expect(text).toContain("contact-123");
    expect(text).toContain("2026-07-18T12:00:00.000Z");
  });

  it("builds a booking notification with all enrolment fields", () => {
    const text = buildBookingNotification({
      _id: "booking-123",
      name: "Applicant",
      email: "applicant@example.com",
      company: "Dev & Co",
      message: "I want to enrol",
      slotStart: new Date("2026-07-20T16:00:00.000Z"),
      slotEnd: new Date("2026-07-20T16:30:00.000Z"),
      createdAt: new Date("2026-07-18T12:00:00.000Z"),
    });

    expect(text).toContain("New DevKofi Enrolment");
    expect(text).toContain("applicant@example.com");
    expect(text).toContain("Dev &amp; Co");
    expect(text).toContain("2026-07-20T16:00:00.000Z");
    expect(text).toContain("2026-07-20T16:30:00.000Z");
    expect(text).toContain("booking-123");
  });

  it("skips delivery when Telegram is disabled or not configured", async () => {
    const result = await sendTelegramNotification("contact", "hello");

    expect(result).toEqual({ skipped: true });
    expect(axios.post).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      "[telegram] contact: notifications disabled or not configured"
    );
  });

  it("posts HTML messages with a five-second timeout", async () => {
    process.env.TELEGRAM_NOTIFICATIONS_ENABLED = "true";
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "123456";
    axios.post.mockResolvedValue({ data: { ok: true } });

    const result = await sendTelegramNotification("booking", "<b>Hello</b>");

    expect(result).toEqual({ skipped: false });
    expect(axios.post).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      {
        chat_id: "123456",
        text: "<b>Hello</b>",
        parse_mode: "HTML",
        disable_web_page_preview: true,
      },
      { timeout: TELEGRAM_TIMEOUT_MS }
    );
  });
});

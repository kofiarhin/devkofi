jest.mock("axios", () => ({ post: jest.fn() }));

const axios = require("axios");
const {
  TELEGRAM_MAX_MESSAGE_LENGTH,
  TELEGRAM_TIMEOUT_MS,
  buildBookingNotification,
  buildContactNotification,
  escapeHtml,
  sendContactTelegramNotification,
  sendTelegramNotification,
} = require("../utils/telegramService");

describe("telegramService", () => {
  const originalEnv = process.env;

  const contact = {
    _id: "contact-123",
    name: "Kofi <Admin>",
    email: "kofi@example.com",
    subject: "Help & support",
    message: "Use <strong>care</strong>",
    createdAt: new Date("2026-07-18T12:00:00.000Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    delete process.env.TELEGRAM_CONTACT_THREAD_ID;
    delete process.env.TELEGRAM_NOTIFICATIONS_ENABLED;
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
    process.env = originalEnv;
  });

  const enableTelegram = () => {
    process.env.TELEGRAM_NOTIFICATIONS_ENABLED = "true";
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "123456";
    axios.post.mockResolvedValue({ data: { ok: true } });
  };

  it("escapes Telegram HTML-sensitive user content", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'test'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;test&#39;"
    );
  });

  it("builds a contact notification with every field and escaped values", () => {
    const text = buildContactNotification(contact);

    expect(text).toContain("New DevKofi Contact Message");
    expect(text).toContain("Kofi &lt;Admin&gt;");
    expect(text).toContain("kofi@example.com");
    expect(text).toContain("Help &amp; support");
    expect(text).toContain("Use &lt;strong&gt;care&lt;/strong&gt;");
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

  it("posts booking HTML messages with a five-second timeout and no topic", async () => {
    enableTelegram();

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

  it("routes a complete short contact notification to the configured topic", async () => {
    enableTelegram();
    process.env.TELEGRAM_CONTACT_THREAD_ID = "2";

    const result = await sendContactTelegramNotification(contact);

    expect(result).toEqual({ skipped: false });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      {
        chat_id: "123456",
        message_thread_id: 2,
        text: buildContactNotification(contact),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      },
      { timeout: TELEGRAM_TIMEOUT_MS }
    );
  });

  it.each(["", "0", "-2", "2.5", "invalid"])(
    "omits an invalid contact topic ID: %p",
    async (threadId) => {
      enableTelegram();
      process.env.TELEGRAM_CONTACT_THREAD_ID = threadId;

      await sendContactTelegramNotification(contact);

      expect(axios.post.mock.calls[0][1]).not.toHaveProperty("message_thread_id");
    }
  );

  it("splits a long contact body into ordered topic messages without truncation", async () => {
    enableTelegram();
    process.env.TELEGRAM_CONTACT_THREAD_ID = "2";
    const longMessage = `${"x".repeat(3999)}😀${"y".repeat(1000)}`;

    await sendContactTelegramNotification({ ...contact, message: longMessage });

    expect(axios.post).toHaveBeenCalledTimes(3);

    const payloads = axios.post.mock.calls.map(([, payload]) => payload);
    payloads.forEach((payload) => {
      expect(payload.chat_id).toBe("123456");
      expect(payload.message_thread_id).toBe(2);
      expect(Array.from(payload.text).length).toBeLessThanOrEqual(
        TELEGRAM_MAX_MESSAGE_LENGTH
      );
    });

    const bodyParts = payloads.slice(1).map((payload) =>
      payload.text.replace(/^<b>Message \(\d+\/\d+\):<\/b>\n/, "")
    );

    expect(bodyParts).toEqual([
      escapeHtml(`${"x".repeat(3999)}😀`),
      escapeHtml("y".repeat(1000)),
    ]);
    expect(bodyParts.join("")).toBe(escapeHtml(longMessage));
  });

  it("stops sending remaining long-message parts when Telegram rejects a part", async () => {
    enableTelegram();
    process.env.TELEGRAM_CONTACT_THREAD_ID = "2";
    axios.post
      .mockResolvedValueOnce({ data: { ok: true } })
      .mockRejectedValueOnce(new Error("Telegram unavailable"));

    await expect(
      sendContactTelegramNotification({
        ...contact,
        message: "x".repeat(5000),
      })
    ).rejects.toThrow("Telegram unavailable");

    expect(axios.post).toHaveBeenCalledTimes(2);
  });
});

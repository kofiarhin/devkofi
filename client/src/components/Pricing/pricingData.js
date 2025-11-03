// data/pricing.data.js
// DevKofi unified pricing strategy

const pricingData = {
  pricing_strategy: {
    single_course: {
      description: "Buy once, keep forever",
      features: [
        "Lifetime access to purchased course",
        "Full-HD video and high-quality audio (where applicable)",
        "Project files / attachments",
        "Certificate of completion (optional)",
        "Access to community/Discord",
        "15-day refund period",
      ],
      refund_policy_days: 15,
      cancel_any_time: false,
    },
    memberships: [
      {
        name: "Monthly Membership (Pro)",
        price: 49,
        currency: "GBP",
        billing_cycle: "monthly",
        features: [
          "Access to all active courses",
          "Priority support",
          "Community access",
          "New modules as added",
          "15-day refund period",
        ],
        cancel_any_time: true,
        notes: "Best to try everything before committing annually",
      },
      {
        name: "Yearly Membership (VIP)",
        price: 399,
        currency: "GBP",
        billing_cycle: "yearly",
        features: [
          "Access to all active courses",
          "Exclusive content and bonuses",
          "Priority support",
          "Community access",
          "New modules as added",
          "15-day refund period",
        ],
        discount: {
          code: "VIP",
          first_year_price: 199,
          description:
            "Use code VIP to get the first year for £199 (save vs monthly).",
        },
        cancel_any_time: true,
        notes: "Best value for learners planning to take multiple courses",
      },
    ],
  },
  single_course_offers: [
    {
      id: 1,
      name: "DevKofi Mentorship",
      price: { amount: 499, currency: "GBP" },
      links: { buy: "/enroll/1" },
      billing_cycle: "one_time",
    },
    {
      id: 2,
      name: "AI Powered Engineer",
      price: { amount: 599, currency: "GBP" },
      links: { buy: "/enroll/2" },
      billing_cycle: "one_time",
    },
    {
      id: 3,
      name: "Automation Engineering with Node.js",
      price: { amount: 499, currency: "GBP" },
      links: { buy: "/enroll/3" },
      billing_cycle: "one_time",
    },
    {
      id: 4,
      name: "Beginner Web Dev: HTML, CSS & JavaScript",
      price: { amount: 299, currency: "GBP" },
      links: { buy: "/enroll/4" },
      billing_cycle: "one_time",
    },
  ],
};

export default pricingData;

const freeUser = {
  firstName: "Kofi",
  lastName: "Mensah",
  email: "new.student@example.com",
  password: "password",
  plan: "none",
  hasPaid: false,
  role: "student",
};

const testUser = {
  firstName: "Test",
  lastName: "User",
  email: "test.user@example.com",
  password: "password",
  plan: "none",
  hasPaid: false,
  role: "student",
};

const standardUser = {
  firstName: "Sarah",
  lastName: "Smith",
  email: "sarah.standard@example.com",
  password: "password",
  plan: "standard",
  hasPaid: true,
  purchaseDate: new Date(),
  role: "student",
};

const proUser = {
  firstName: "David",
  lastName: "Chen",
  email: "david.pro@example.com",
  password: "password",
  plan: "pro",
  hasPaid: true,
  purchaseDate: new Date("2023-11-01"),
  mentorshipCredits: 5,
  discordUsername: "david_code#1234",
  role: "student",
};

const enterpriseUser = {
  firstName: "Emily",
  lastName: "Wong",
  email: "emily@techcorp.com",
  password: "password",
  plan: "enterprise",
  hasPaid: true,
  purchaseDate: new Date(),
  teamName: "TechCorp Devs",
  discordUsername: "emily_wong_dev",
  role: "student",
};

module.exports = { freeUser, standardUser, proUser, enterpriseUser, testUser };

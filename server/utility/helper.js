const Newsletter = require("../Model/newsletterModel");
const Mentorship = require("../Model/mentorshipModel");
const sendEmail = require("./sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/userModel");
const {
  welcomeEmail,
  generateNewSubscriptionEmail,
} = require("./templates.js");

const createNewsletterUser = async (data) => {
  try {
    const { email } = data;
    const check = await Newsletter.findOne({ email });
    if (check) {
      throw new Error("user already exist");
    }

    const user = await Newsletter.create({ email });

    if (!user) {
      throw new Error("there was a problem createing user please try again");
    }
    return user;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

const joinMentorship = async (data) => {
  try {
    const user = await Mentorship.create(data);
    return user;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// fetchContributions.js
const fetchGitHubContributions = async () => {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token) throw new Error("Missing GITHUB_TOKEN environment variable");
  if (!username)
    throw new Error("Missing GITHUB_USERNAME environment variable");

  const query = `
    query($login:String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);

  const data = await res.json();
  return data.data.user.contributionsCollection.contributionCalendar
    .totalContributions;
};

// fetchDailyContributions.js (Node 18+)
const fetchDailyGitHubContributions = async () => {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  if (!token) throw new Error("Missing GITHUB_TOKEN");
  if (!username) throw new Error("Missing GITHUB_USERNAME");

  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 365);

  const query = `
    query($login:String!, $from:DateTime!, $to:DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "daily-contrib-script",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!res.ok)
    throw new Error(`GitHub API error ${res.status} ${res.statusText}`);
  const json = await res.json();

  const weeks =
    json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ||
    [];
  const days = weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));

  return { data: days };
};

const createUser = async (userData) => {
  const { password, ...rest } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    ...rest,
    password: hashedPassword,
  });

  const { password: userPassword, ...r } = newUser._doc;
  return { ...r };
};

module.exports = {
  createUser,
  createNewsletterUser,
  joinMentorship,
  generateToken,
  fetchGitHubContributions,
  fetchDailyGitHubContributions,
};

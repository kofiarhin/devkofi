const BlogPost = require("../models/BlogPost");
const Booking = require("../models/Booking");
const ContactMessage = require("../models/ContactMessage");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");

const getAdminOverview = async (req, res) => {
  const now = new Date();
  const [articleCounts, bookingCounts, messageCounts, subscriberCounts, posts, bookings, messages, subscribers] = await Promise.all([
    BlogPost.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Promise.all([Booking.countDocuments(), Booking.countDocuments({ status: "booked", slotStart: { $gte: now } }), Booking.countDocuments({ status: "cancelled" })]),
    Promise.all([ContactMessage.countDocuments(), ContactMessage.countDocuments({ isRead: false, isArchived: { $ne: true } }), ContactMessage.countDocuments({ isArchived: true })]),
    Promise.all([NewsletterSubscriber.countDocuments(), NewsletterSubscriber.countDocuments({ verified: true }), NewsletterSubscriber.countDocuments({ verified: false })]),
    BlogPost.find().select("title status updatedAt").sort({ updatedAt: -1 }).limit(4).lean(),
    Booking.find().select("name status updatedAt").sort({ updatedAt: -1 }).limit(4).lean(),
    ContactMessage.find().select("name isRead isArchived updatedAt").sort({ updatedAt: -1 }).limit(4).lean(),
    NewsletterSubscriber.find().select("email verified updatedAt").sort({ updatedAt: -1 }).limit(4).lean(),
  ]);

  const articleMap = Object.fromEntries(articleCounts.map((item) => [item._id, item.count]));
  const recentActivity = [
    ...posts.map((item) => ({ id: item._id, type: "article", label: item.title, status: item.status, at: item.updatedAt })),
    ...bookings.map((item) => ({ id: item._id, type: "booking", label: item.name, status: item.status, at: item.updatedAt })),
    ...messages.map((item) => ({ id: item._id, type: "message", label: item.name, status: item.isArchived ? "archived" : item.isRead ? "read" : "unread", at: item.updatedAt })),
    ...subscribers.map((item) => ({ id: item._id, type: "subscriber", label: item.email, status: item.verified ? "verified" : "unverified", at: item.updatedAt })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 10);

  return res.json({
    success: true,
    data: {
      articles: { total: Object.values(articleMap).reduce((sum, count) => sum + count, 0), published: articleMap.published || 0, draft: articleMap.draft || 0, archived: articleMap.archived || 0 },
      bookings: { total: bookingCounts[0], upcoming: bookingCounts[1], cancelled: bookingCounts[2] },
      messages: { total: messageCounts[0], unread: messageCounts[1], archived: messageCounts[2] },
      subscribers: { total: subscriberCounts[0], verified: subscriberCounts[1], unverified: subscriberCounts[2] },
      recentActivity,
    },
  });
};

module.exports = { getAdminOverview };

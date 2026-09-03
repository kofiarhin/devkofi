const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const { escapeSearch, isValidId, parsePagination } = require("../utils/adminValidation");

const listSubscribers = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const query = {};
  if (req.query.verified === "true") query.verified = true;
  if (req.query.verified === "false") query.verified = false;
  const search = escapeSearch(req.query.search);
  if (search) query.email = new RegExp(search, "i");
  const projection = "email verified verifiedAt createdAt updatedAt";
  const [items, total] = await Promise.all([NewsletterSubscriber.find(query).select(projection).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), NewsletterSubscriber.countDocuments(query)]);
  return res.json({ success: true, data: { items, subscribers: items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } });
};

const deleteSubscriber = async (req, res) => {
  if (!isValidId(req.params.subscriberId)) return res.status(400).json({ success: false, error: "Invalid subscriber id" });
  const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.subscriberId).select("email");
  if (!subscriber) return res.status(404).json({ success: false, error: "Subscriber not found" });
  return res.json({ success: true, data: { id: subscriber._id } });
};

module.exports = { deleteSubscriber, listSubscribers };

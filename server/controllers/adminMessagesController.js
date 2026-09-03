const ContactMessage = require("../models/ContactMessage");
const { escapeSearch, isValidId, parsePagination } = require("../utils/adminValidation");

const findMessage = async (id, res) => {
  if (!isValidId(id)) { res.status(400).json({ success: false, error: "Invalid message id" }); return null; }
  const item = await ContactMessage.findById(id);
  if (!item) { res.status(404).json({ success: false, error: "Message not found" }); return null; }
  return item;
};

const listMessages = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const query = {};
  if (req.query.read === "read") query.isRead = true;
  if (req.query.read === "unread") query.isRead = false;
  if (req.query.archived === "true") query.isArchived = true;
  else if (req.query.archived !== "all") query.isArchived = { $ne: true };
  const search = escapeSearch(req.query.search);
  if (search) { const pattern = new RegExp(search, "i"); query.$or = [{ name: pattern }, { email: pattern }, { subject: pattern }, { message: pattern }]; }
  const [items, total] = await Promise.all([ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), ContactMessage.countDocuments(query)]);
  return res.json({ success: true, data: { items, messages: items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } });
};

const setReadState = async (req, res) => {
  if (typeof req.body.isRead !== "boolean") return res.status(400).json({ success: false, error: "isRead must be a boolean" });
  const message = await findMessage(req.params.messageId, res); if (!message) return undefined;
  message.isRead = req.body.isRead; message.readAt = req.body.isRead ? new Date() : null; await message.save();
  return res.json({ success: true, data: { message } });
};

const setArchived = (archived) => async (req, res) => {
  const message = await findMessage(req.params.messageId, res); if (!message) return undefined;
  message.isArchived = archived; message.archivedAt = archived ? new Date() : null; await message.save();
  return res.json({ success: true, data: { message } });
};

module.exports = { archiveMessage: setArchived(true), listMessages, restoreMessage: setArchived(false), setReadState };
